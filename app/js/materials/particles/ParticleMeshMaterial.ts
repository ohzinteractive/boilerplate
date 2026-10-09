import { AddEquation, CustomBlending, OneFactor, Vector2 } from 'three';
import { abs, cameraProjectionMatrix, clamp, exp, float, fract, instanceIndex, length, max, min, mix, mod, modelViewMatrix, positionGeometry, pow, saturate, uniform, uv, varying, vec3, vec4 } from 'three/tsl';
import type { Node, StorageBufferNode } from 'three/webgpu';
import { NodeMaterial } from 'three/webgpu';

// Standard HSV to RGB, branchless.
const hsv_to_rgb = (h: Node<'float'>, s: Node<'float'>, v: Node<'float'>) =>
{
  const rgb = clamp(abs(mod(h.mul(6).add(vec3(0, 4, 2)), 6).sub(3)).sub(1), 0, 1);

  return mix(vec3(1), rgb, s).mul(v);
};

const gaussian = (x: Node<'float'>, sigma: Node<'float'>) => exp(x.mul(x).negate().div(sigma.mul(sigma).mul(2)));

// Draws each particle as a camera facing disc at the position ParticleMesh
// prepares every frame (render_positions: xyz position, w distance from rest). Particles displaced from their rest position
// grow, blur and turn colorful; at rest they show the shape color.
//
// The output is gamma encoded and premultiplied (One/One blending), exactly
// what the lab shader wrote to its WebGL canvas. DemoScene renders it straight
// to the canvas (see use_display_output), so overlapping particles add up in
// gamma space like in the lab.
export class ParticleMeshMaterial extends NodeMaterial
{
  uniforms: {
    _Size: Node<'float'> & { value: number };
    _BlurSize: Node<'float'> & { value: number };
    _BlurDistance: Node<'float'> & { value: number };
    _BlurOpacity: Node<'float'> & { value: number };
    _BlurExponent: Node<'float'> & { value: number };
    _UseBlur: Node<'float'> & { value: number };
    _HDRBoost: Node<'float'> & { value: number };
    _BaseBrightness: Node<'float'> & { value: number };
    _OpacityRange: Node<'vec2'> & { value: Vector2 };
  };

  constructor(render_positions: StorageBufferNode<'vec4'>, positions: StorageBufferNode<'vec4'>, colors: StorageBufferNode<'vec4'>)
  {
    super();

    this.transparent = true;
    this.depthWrite = false;
    this.depthTest = false;
    this.blending = CustomBlending;
    this.blendEquation = AddEquation;
    this.blendSrc = OneFactor;
    this.blendDst = OneFactor;

    const u = this.uniforms = {
      _Size: uniform(0),
      _BlurSize: uniform(1),
      _BlurDistance: uniform(0),
      _BlurOpacity: uniform(1),
      _BlurExponent: uniform(1),
      _UseBlur: uniform(1),
      _HDRBoost: uniform(1),
      _BaseBrightness: uniform(1),
      _OpacityRange: uniform(new Vector2(0, 1))
    };

    const render_position = render_positions.element(instanceIndex);
    const distance_from_start = render_position.w;

    // Vertex: view space billboard
    const view_position = modelViewMatrix.mul(vec4(render_position.xyz, 1));

    const blur = pow(saturate(distance_from_start.mul(u._BlurDistance)), u._BlurExponent).mul(u._UseBlur);
    const size = u._Size.mul(mix(1, u._BlurSize, blur));

    this.vertexNode = cameraProjectionMatrix.mul(vec4(view_position.xy.add(positionGeometry.xy.mul(size)), view_position.zw));

    // Fragment
    const v_hue = varying(positions.element(instanceIndex).w, 'v_hue');
    const v_distance = varying(distance_from_start, 'v_distance');
    const v_blur_opacity = varying(mix(1, u._BlurOpacity, blur), 'v_blur_opacity');
    const v_color = varying(colors.element(instanceIndex).xyz, 'v_color');

    // Only the shape's saturation and value are kept; the hue cycles over time
    const base_color = v_color.mul(u._BaseBrightness);
    const value = max(base_color.r, max(base_color.g, base_color.b));
    const saturation = value.sub(min(base_color.r, min(base_color.g, base_color.b))).div(max(value, 1e-6));

    const velocity = saturate(v_distance);
    const rgb = hsv_to_rgb(
      fract(v_hue),
      mix(saturation, 0.8, velocity),
      mix(value, 1, velocity)
    );

    // Soft disc whose edge widens with the blur factor
    const blur_factor = saturate(v_distance.mul(u._BlurDistance)).mul(u._UseBlur);
    const sigma = blur_factor.mul(0.7);
    const radius = float(1).sub(sigma.mul(3));
    const disc = gaussian(max(0, length(uv().mul(2).sub(1)).sub(radius)), max(0.0001, sigma));

    const opacity = mix(u._OpacityRange.x, u._OpacityRange.y, velocity).mul(disc).mul(v_blur_opacity);

    // On HDR output, displaced particles can go brighter than SDR white
    const hdr_gain = mix(1, u._HDRBoost, velocity);

    this.fragmentNode = vec4(pow(rgb.mul(opacity), vec3(1 / 2.2)).mul(opacity).mul(hdr_gain), opacity);
  }
}
