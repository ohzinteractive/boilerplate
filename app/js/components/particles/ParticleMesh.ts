import { CameraUtilities, Graphics, OMath, Time } from 'ohzi-core';
import type { Camera } from 'three';
import { Box3, CircleGeometry, MathUtils, Matrix4, Mesh, Quaternion, Ray, Vector2, Vector3 } from 'three';
import { clamp, dot, float, Fn, instancedArray, instanceIndex, length, max, saturate, uniform, vec4 } from 'three/tsl';
import type { ComputeNode, Node, StorageBufferNode } from 'three/webgpu';

import { curl_noise, snoise_vec3 } from '../../materials/particles/curl_noise.tsl';
import { ParticleMeshMaterial } from '../../materials/particles/ParticleMeshMaterial';
import type { ParticleForces } from '../../Settings';
import { Settings } from '../../Settings';
import type { SampledShape } from './MeshSampler';

// The lab simulation advanced a fixed 0.016 per rendered frame, so its forces
// and damping are tuned per step. Stepping at a fixed 60 Hz keeps that tuning
// and makes the motion independent of the display refresh rate.
const SIMULATION_STEP = 0.016;
const MAX_STEPS_PER_FRAME = 4;

// Pointer moves longer than this (in NDC) are treated as jumps, not swipes
const MAX_POINTER_JUMP = 0.4;

export interface ParticleLook
{
  use_blur: boolean;
  size_scale: number; // multiplies Settings.particles.size
  hdr_boost: number;  // brightness of displaced particles, above 1 only on HDR output
}

interface PointerState
{
  NDC: { x: number; y: number };
  NDC_delta: { x: number; y: number };
  pointer_count: number;
}

const distance_to_segment = (a: Node<'vec2'>, b: Node<'vec2'>, p: Node<'vec2'>) =>
{
  const ab = b.sub(a);
  const t = clamp(dot(p.sub(a), ab).div(max(dot(ab, ab), 1e-8)), 0, 1);

  return length(p.sub(a.add(ab.mul(t))));
};

// GPU particle system that holds a sampled shape. Particles get pushed by the
// pointer, swirl through curl noise and spring back to their rest position.
//
// TSL port of the lab GPUParticleSystem: the position and velocity render
// targets became storage buffers updated by two compute passes, which run on
// WebGPU and on the WebGL 2 fallback (transform feedback).
export class ParticleMesh extends Mesh
{
  declare material: ParticleMeshMaterial;

  count: number;
  particle_count: number;
  shape_bounds: Box3;

  positions: StorageBufferNode<'vec4'>;
  render_positions: StorageBufferNode<'vec4'>;
  velocities: StorageBufferNode<'vec4'>;
  initial_positions: StorageBufferNode<'vec4'>;
  colors: StorageBufferNode<'vec4'>;

  compute_velocity: ComputeNode;
  compute_position: ComputeNode;
  compute_render_position: ComputeNode;

  simulation_uniforms: {
    _DeltaTime: Node<'float'> & { value: number };
    _MousePos: Node<'vec2'> & { value: Vector2 };
    _PreviousMousePos: Node<'vec2'> & { value: Vector2 };
    _CameraRightDir: Node<'vec3'> & { value: Vector3 };
    _CameraUpDir: Node<'vec3'> & { value: Vector3 };
    _ModelViewProjection: Node<'mat4'> & { value: Matrix4 };
    _MouseDisplacementForce: Node<'float'> & { value: number };
    _MouseDisplacementNoiseStrength: Node<'float'> & { value: number };
    _ReturnToOriginForce: Node<'float'> & { value: number };
    _ElapsedTime: Node<'float'> & { value: number };
    _ConstantNoiseStrength: Node<'float'> & { value: number };
  };

  step_accumulator: number;
  mouse_over_strength: number;
  mouse_over_strength_decay_delay: number;

  tmp_position: Vector3;
  tmp_quaternion: Quaternion;
  tmp_scale: Vector3;
  tmp_matrix: Matrix4;
  tmp_ray: Ray;

  constructor(shape: SampledShape)
  {
    const count = shape.count;

    const position_arr = new Float32Array(count * 4);
    const color_arr = new Float32Array(count * 4);

    for (let i = 0; i < count; i++)
    {
      position_arr.set(shape.positions.subarray(i * 3, i * 3 + 3), i * 4);
      color_arr.set(shape.colors.subarray(i * 3, i * 3 + 3), i * 4);
    }

    // xyz: position, w: hue phase
    const positions = instancedArray(position_arr.slice(), 'vec4');
    // xyz: drawn position (with the constant wobble), w: distance from the rest position
    const render_positions = instancedArray(count, 'vec4');
    const initial_positions = instancedArray(position_arr, 'vec4');
    const velocities = instancedArray(count, 'vec4');
    const colors = instancedArray(color_arr, 'vec4');

    super(new CircleGeometry(1, 8), new ParticleMeshMaterial(render_positions, positions, colors));

    this.particle_count = count;
    this.count = count;
    this.frustumCulled = false;

    this.positions = positions;
    this.render_positions = render_positions;
    this.velocities = velocities;
    this.initial_positions = initial_positions;
    this.colors = colors;

    this.shape_bounds = new Box3().setFromArray(shape.positions);

    this.step_accumulator = 0;
    this.mouse_over_strength = 0;
    this.mouse_over_strength_decay_delay = 0;

    this.tmp_position = new Vector3();
    this.tmp_quaternion = new Quaternion();
    this.tmp_scale = new Vector3();
    this.tmp_matrix = new Matrix4();
    this.tmp_ray = new Ray();

    this.simulation_uniforms = {
      _DeltaTime: uniform(SIMULATION_STEP),
      _MousePos: uniform(new Vector2()),
      _PreviousMousePos: uniform(new Vector2()),
      _CameraRightDir: uniform(new Vector3(1, 0, 0)),
      _CameraUpDir: uniform(new Vector3(0, 1, 0)),
      _ModelViewProjection: uniform(new Matrix4()),
      _MouseDisplacementForce: uniform(0),
      _MouseDisplacementNoiseStrength: uniform(0),
      _ReturnToOriginForce: uniform(0),
      _ElapsedTime: uniform(0),
      _ConstantNoiseStrength: uniform(0)
    };

    this.compute_velocity = this.build_velocity_compute();
    this.compute_position = this.build_position_compute();
    this.compute_render_position = this.build_render_position_compute();
  }

  // three's WebGL backend caches compute programs by their GLSL and keeps the
  // storage buffers of the first kernel that built it, so a second ParticleMesh
  // would end up simulating the first one's buffers. Passing each output through
  // an identity function named after this mesh makes its kernels' code unique.
  // WebGPU is not affected.
  build_unique_output()
  {
    return Fn(([value]: [Node<'vec4'>]) => value).setLayout({
      name: `particle_mesh_${this.id}_output`,
      type: 'vec4',
      inputs: [{ name: 'value', type: 'vec4' }]
    });
  }

  build_velocity_compute()
  {
    const u = this.simulation_uniforms;
    const unique_output = this.build_unique_output();

    return Fn(() =>
    {
      const velocity = this.velocities.element(instanceIndex);
      const position = this.positions.element(instanceIndex).xyz;
      const initial_position = this.initial_positions.element(instanceIndex).xyz;

      const clip_position = u._ModelViewProjection.mul(vec4(position, 1));
      const screen_position = clip_position.xy.div(clip_position.w);

      const mouse_dir = u._MousePos.sub(u._PreviousMousePos).mul(100);
      const proximity = saturate(float(1).sub(distance_to_segment(u._PreviousMousePos, u._MousePos, screen_position).div(0.05)));

      const mouse_displacement = u._CameraUpDir.mul(mouse_dir.y).add(u._CameraRightDir.mul(mouse_dir.x)).mul(proximity);

      const acceleration = mouse_displacement.mul(u._MouseDisplacementForce)
        .add(initial_position.sub(position).mul(u._ReturnToOriginForce))
        .add(curl_noise(position).mul(length(velocity.xyz)).mul(u._MouseDisplacementNoiseStrength));

      velocity.assign(unique_output(vec4(velocity.xyz.add(acceleration.mul(u._DeltaTime)).mul(0.9), 0)));
    })().compute(this.particle_count);
  }

  build_position_compute()
  {
    const u = this.simulation_uniforms;
    const unique_output = this.build_unique_output();

    return Fn(() =>
    {
      const particle = this.positions.element(instanceIndex);
      const velocity = this.velocities.element(instanceIndex).xyz;

      particle.assign(unique_output(vec4(particle.xyz.add(velocity.mul(u._DeltaTime)), particle.w.add(u._DeltaTime.mul(0.1)))));
    })().compute(this.particle_count);
  }

  // Per frame, not per simulation step: the wobble follows the elapsed time.
  // Evaluated once per particle here instead of once per vertex when drawing.
  build_render_position_compute()
  {
    const u = this.simulation_uniforms;
    const unique_output = this.build_unique_output();

    return Fn(() =>
    {
      const position = this.positions.element(instanceIndex).xyz;
      const initial_position = this.initial_positions.element(instanceIndex).xyz;

      const constant_noise = snoise_vec3(position.mul(1.35).add(u._ElapsedTime.mul(0.25))).mul(u._ConstantNoiseStrength);

      this.render_positions.element(instanceIndex).assign(unique_output(vec4(position.add(constant_noise), length(position.sub(initial_position)))));
    })().compute(this.particle_count);
  }

  update(camera: Camera, pointer: PointerState, forces: ParticleForces, look: ParticleLook)
  {
    this.updateWorldMatrix(true, false);

    this.update_simulation_uniforms(camera, forces);
    this.update_mouse_over(camera, pointer);
    this.update_material(look);

    this.step_accumulator = Math.min(this.step_accumulator + Time.delta_time, SIMULATION_STEP * MAX_STEPS_PER_FRAME);

    while (this.step_accumulator >= SIMULATION_STEP)
    {
      this.step_accumulator -= SIMULATION_STEP;

      this.update_pointer(pointer);

      void Graphics._renderer.compute(this.compute_velocity);
      void Graphics._renderer.compute(this.compute_position);
    }

    this.simulation_uniforms._ElapsedTime.value = Time.elapsed_time;
    this.simulation_uniforms._ConstantNoiseStrength.value = Settings.particles.constant_noise_strength;

    void Graphics._renderer.compute(this.compute_render_position);
  }

  update_pointer(pointer: PointerState)
  {
    const u = this.simulation_uniforms;

    u._PreviousMousePos.value.copy(u._MousePos.value);

    if (pointer.pointer_count > 0)
    {
      u._MousePos.value.copy(pointer.NDC);

      if (u._MousePos.value.distanceTo(u._PreviousMousePos.value) > MAX_POINTER_JUMP)
      {
        u._PreviousMousePos.value.copy(u._MousePos.value);
      }
    }
  }

  update_simulation_uniforms(camera: Camera, forces: ParticleForces)
  {
    const u = this.simulation_uniforms;

    u._ModelViewProjection.value
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      .multiply(this.matrixWorld);

    // The pointer pushes along the camera axes, expressed in this mesh's space
    this.matrixWorld.decompose(this.tmp_position, this.tmp_quaternion, this.tmp_scale);
    this.tmp_quaternion.invert();

    u._CameraRightDir.value.copy(CameraUtilities.get_right_dir(camera)).applyQuaternion(this.tmp_quaternion);
    u._CameraUpDir.value.copy(CameraUtilities.get_up_dir(camera)).applyQuaternion(this.tmp_quaternion);

    u._MouseDisplacementForce.value = forces.mouse_displacement_force;
    u._ReturnToOriginForce.value = forces.return_to_origin_force;
    u._MouseDisplacementNoiseStrength.value = forces.mouse_displacement_noise_strength;
  }

  // Moving the pointer over the shape lowers the resting opacity for a moment
  update_mouse_over(camera: Camera, pointer: PointerState)
  {
    if (pointer.pointer_count > 0)
    {
      this.tmp_ray.origin.setFromMatrixPosition(camera.matrixWorld);
      this.tmp_ray.direction.set(pointer.NDC.x, pointer.NDC.y, 0.5).unproject(camera).sub(this.tmp_ray.origin).normalize();
      this.tmp_ray.applyMatrix4(this.tmp_matrix.copy(this.matrixWorld).invert());

      if (this.tmp_ray.intersectsBox(this.shape_bounds))
      {
        this.add_mouse_over_strength(Math.hypot(pointer.NDC_delta.x, pointer.NDC_delta.y) * 100 * Time.delta_time);
      }
    }

    this.mouse_over_strength = OMath.saturate(this.mouse_over_strength);

    this.mouse_over_strength_decay_delay = OMath.saturate(this.mouse_over_strength_decay_delay - Time.delta_time);

    if (this.mouse_over_strength_decay_delay < 0.001)
    {
      this.mouse_over_strength *= 0.9;
    }
  }

  add_mouse_over_strength(value: number)
  {
    this.mouse_over_strength += value;
    this.mouse_over_strength_decay_delay = OMath.saturate(this.mouse_over_strength_decay_delay + value * 10);
  }

  update_material(look: ParticleLook)
  {
    const u = this.material.uniforms;
    const settings = Settings.particles;

    u._Size.value = settings.size * look.size_scale;
    u._BlurSize.value = settings.blur_size;
    u._BlurDistance.value = settings.blur_distance;
    u._BlurOpacity.value = settings.blur_opacity;
    u._BlurExponent.value = settings.blur_exponent;
    u._UseBlur.value = look.use_blur ? 1 : 0;
    u._HDRBoost.value = look.hdr_boost;
    u._BaseBrightness.value = settings.base_brightness;

    u._OpacityRange.value.set(
      MathUtils.lerp(settings.opacity_range.min, 0.2, this.mouse_over_strength),
      settings.opacity_range.max
    );
  }

  dispose()
  {
    this.geometry.dispose();
    this.material.dispose();
    this.compute_velocity.dispose();
    this.compute_position.dispose();
    this.compute_render_position.dispose();
  }
}
