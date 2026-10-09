import { CommonScene } from './common/CommonScene';

import { Settings } from '../Settings';
import { Sections } from '../views/Sections';

import { demo_fonts } from '../../data/assets/demo/demo_fonts';
import { demo_high_objects } from '../../data/assets/demo/high/demo_high_objects';
import { demo_high_sounds } from '../../data/assets/demo/high/demo_high_sounds';
import { demo_high_textures } from '../../data/assets/demo/high/demo_high_textures';
import { demo_objects } from '../../data/assets/demo/demo_objects';
import { demo_sounds } from '../../data/assets/demo/demo_sounds';
import { demo_textures } from '../../data/assets/demo/demo_textures';

import { CameraController, CameraManager, Debug, Graphics, Grid, OS, OScreen, PerspectiveCamera, ResourceContainer, Time } from 'ohzi-core';
import type { BufferGeometry, Object3D, Quaternion } from 'three';
import { Box3, Color, DoubleSide, LinearSRGBColorSpace, MathUtils, Mesh, MeshBasicMaterial, Raycaster, Vector2, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontsCompilator } from '../compilators/FontsCompilator';
import { MeshSampler } from '../components/particles/MeshSampler';
import type { ParticleLook } from '../components/particles/ParticleMesh';
import { ParticleMesh } from '../components/particles/ParticleMesh';
import { Input } from '../components/Input';
import { AsyncFontLoader } from '../loaders/AsyncFontLoader';

const TEXT = 'boilerplate';
const TEXT_SIZE = 1.4;
const TEXT_DEPTH = 0.3;

// The text gets its outline from its side walls, seen edge on. The logo gets the
// same outline from particles along its edges, as many per unit of length as a
// wall this deep would put there.
const LOGO_STROKE_DEPTH = TEXT_DEPTH;

// Same particle count as the lab logo. The text gets the same density,
// so its count follows from its surface area.
const LOGO_PARTICLE_COUNT = 50000;
const MAX_TEXT_PARTICLE_COUNT = 150000;

// Isometric view of the logo, as in the lab
const CAMERA_FOV = 20;
// Perspective depends on the distance only, so it is the same on every
// screen and the fov frames the content. Far enough to look nearly flat.
const CAMERA_DISTANCE = 36;
const CAMERA_TILT = 45;
const CAMERA_ORIENTATION = 45;

const LAYOUT_GAP = 0.6;
const LAYOUT_MARGIN = 1.15;
const PORTRAIT_TEXT_WIDTH = 1.8; // text width relative to the logo width

// Landing page of the boilerplate itself: the OHZI logo and the word
// "boilerplate" made of interactive particles. Swipe to push them around,
// hold to make them snap back faster.
export class DemoScene extends CommonScene
{
  camera: PerspectiveCamera;
  camera_controller: CameraController;

  particle_look: ParticleLook;

  logo_particles: ParticleMesh;
  text_particles: ParticleMesh;

  previous_output_color_space: string;

  rest_rotation: Quaternion;
  logo_bounds: Box3;
  text_bounds: Box3;

  target_NDC: Vector2;
  current_NDC: Vector2;

  hold_time: number;
  hold_travel: number;
  holding: boolean;

  constructor()
  {
    super({
      name: Sections.DEMO
    });
  }

  init()
  {
    super.init();

    this.camera_controller = new CameraController(Input);

    this.target_NDC = new Vector2();
    this.current_NDC = new Vector2();

    this.hold_time = 0;
    this.hold_travel = 0;
    this.holding = false;

    this.init_camera();
    this.setup_camera();

    this.set_assets(demo_objects, demo_textures, demo_sounds, [AsyncFontLoader], [FontsCompilator], [demo_fonts]);

    if (Settings.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  update()
  {
    super.update();

    if (!this.logo_particles)
    {
      return;
    }

    this.update_layout();
    this.update_camera_rotation();

    this.camera_controller.update();
    this.camera.updateMatrixWorld();

    this.update_hold();

    const forces = this.is_turbo() ? Settings.particles_turbo : Settings.particles_normal;
    this.particle_look.use_blur = !OScreen.portrait;

    this.logo_particles.update(this.camera, Input, forces, this.particle_look);
    this.text_particles.update(this.camera, Input, forces, this.particle_look);
  }

  render()
  {
    // Enter transitions set the camera fov too; the layout wins
    if (this.logo_particles)
    {
      this.update_layout();
    }

    super.render();
  }

  // The lab drew its particles additively, straight on a gamma encoded canvas,
  // and the particle material outputs those same display ready values. With
  // a linear output color space the renderer draws to the canvas as it is:
  // no internal framebuffer, no output pass, and particles add up in gamma
  // space like in the lab. Anything else in this scene should output display
  // ready colors too. Other views expect sRGB output, so it is restored on exit.
  use_display_output(enabled: boolean)
  {
    const renderer = Graphics._renderer;

    if (enabled)
    {
      this.previous_output_color_space = renderer.outputColorSpace;
      renderer.outputColorSpace = LinearSRGBColorSpace;
    }
    else if (this.previous_output_color_space)
    {
      renderer.outputColorSpace = this.previous_output_color_space;
    }
  }

  is_webgpu()
  {
    return (Graphics._renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend === true;
  }

  on_assets_ready()
  {
    this.set_high_assets(demo_high_objects, demo_high_textures, demo_high_sounds);

    super.on_assets_ready();

    this.build_particles();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }

  build_particles()
  {
    // The WebGL fallback and mobile devices draw fewer, bigger particles
    const backend_density = this.is_webgpu() ? 1 : Settings.particles.webgl_density;
    const device_density = OS.is_mobile || OS.is_ipad ? Settings.particles.mobile_density : 1;
    const density = backend_density * device_density;

    this.particle_look = {
      use_blur: true,
      // Bigger particles make up for part of the missing ones. Making up for
      // all of them (1 / sqrt) looked blurry on phones.
      size_scale: Math.pow(density, -0.25),
      hdr_boost: this.is_webgpu() && Settings.hdr ? Settings.particles.hdr_boost : 1
    };

    const logo = ResourceContainer.get('ohzi_cube').scene;
    const logo_geometries = ['white', 'black'].map((name) => (logo.getObjectByName(name) as Mesh).geometry);

    // The text is only seen from the front, so its back faces are left out. Through
    // the gaps of the front letters they showed up as stray lines (the bars of e and t).
    const text_geometry = this.build_text_geometry();
    const is_not_back_face = (normal: Vector3) => normal.z > -0.5;

    const logo_count = Math.round(LOGO_PARTICLE_COUNT * density);
    const logo_area = MeshSampler.get_area(logo_geometries);
    const text_area = MeshSampler.get_area([text_geometry], is_not_back_face);
    const text_count = Math.min(Math.round(logo_count * text_area / logo_area), MAX_TEXT_PARTICLE_COUNT);

    // Only the edges the camera sees get a stroke, like the text outline
    const logo_edges = MeshSampler.build_edges(logo_geometries);
    const visible_edges = MeshSampler.filter_lines(logo_edges, this.build_visibility_test(logo_geometries), 0.05);
    const stroke_count = Math.round(logo_count / logo_area * LOGO_STROKE_DEPTH * MeshSampler.get_length(visible_edges));

    this.logo_particles = new ParticleMesh(MeshSampler.merge([
      MeshSampler.sample(logo_geometries, logo_count),
      MeshSampler.sample_lines(visible_edges, stroke_count)
    ]));

    logo_edges.dispose();
    visible_edges.dispose();
    this.text_particles = new ParticleMesh(MeshSampler.sample([text_geometry], text_count, is_not_back_face));

    this.logo_bounds = this.logo_particles.shape_bounds;
    this.text_bounds = this.text_particles.shape_bounds;

    text_geometry.dispose();

    this.add(this.logo_particles);
    this.add(this.text_particles);
  }

  // Whether a point on the logo is in sight from the camera's rest direction
  build_visibility_test(geometries: BufferGeometry[])
  {
    // Double sided: the model only has the faces meant to be seen, so a ray
    // from a hidden edge often reaches the face in front of it from behind
    const material = new MeshBasicMaterial({ side: DoubleSide });
    const meshes = geometries.map((geometry) => new Mesh(geometry, material));
    const to_camera = new Vector3(0, 0, 1).applyQuaternion(this.rest_rotation);
    const raycaster = new Raycaster();
    const origin = new Vector3();

    // Starting a bit off the surface skips the faces the edge belongs to
    const offset = 0.01;

    return (point: Vector3) =>
    {
      raycaster.set(origin.copy(point).addScaledVector(to_camera, offset), to_camera);

      return raycaster.intersectObjects(meshes, false).length === 0;
    };
  }

  build_text_geometry(): BufferGeometry
  {
    const geometry = new TextGeometry(TEXT, {
      font: ResourceContainer.get('inter_bold'),
      size: TEXT_SIZE,
      depth: TEXT_DEPTH,
      curveSegments: 8,
      bevelEnabled: false
    });

    // Left edge at x = 0, baseline to ascender centered on y = 0, depth centered on z = 0
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    geometry.translate(-bounds.min.x, -bounds.max.y / 2, -TEXT_DEPTH / 2);

    return geometry;
  }

  // Places the text next to the logo (below it in portrait) and frames both.
  // Everything is measured on the camera's rest plane, so the layout holds
  // while the pointer tilts the camera around.
  update_layout()
  {
    const right = new Vector3(1, 0, 0).applyQuaternion(this.rest_rotation);
    const up = new Vector3(0, 1, 0).applyQuaternion(this.rest_rotation);

    const logo_rect = this.get_projected_rect(this.logo_bounds, right, up);
    const logo_width = logo_rect.max.x - logo_rect.min.x;
    const text_width = this.text_bounds.max.x - this.text_bounds.min.x;

    let text_scale = 1;
    const text_offset = new Vector2();

    if (OScreen.portrait)
    {
      text_scale = logo_width * PORTRAIT_TEXT_WIDTH / text_width;
      text_offset.set(-text_width * text_scale / 2, logo_rect.min.y - LAYOUT_GAP - this.text_bounds.max.y * text_scale);
    }
    else
    {
      text_offset.set(logo_rect.max.x + LAYOUT_GAP, 0);
    }

    this.text_particles.scale.setScalar(text_scale);

    // Scaling the text down packs its particles tighter; draw a subset to keep the logo's density.
    // Particles are sampled in random order, so any prefix is spread evenly over the shape.
    this.text_particles.count = Math.round(this.text_particles.particle_count * Math.min(1, text_scale * text_scale));
    const text_origin = right.clone().multiplyScalar(text_offset.x).addScaledVector(up, text_offset.y);

    const content_rect = logo_rect.clone().union(new Box3(
      new Vector3(text_offset.x + this.text_bounds.min.x * text_scale, text_offset.y + this.text_bounds.min.y * text_scale, 0),
      new Vector3(text_offset.x + this.text_bounds.max.x * text_scale, text_offset.y + this.text_bounds.max.y * text_scale, 0)
    ));

    const center = content_rect.getCenter(new Vector3());
    const size = content_rect.getSize(new Vector3()).multiplyScalar(LAYOUT_MARGIN / 2);
    const logo_center = logo_rect.getCenter(new Vector3());

    const zoom = CAMERA_DISTANCE;
    const tan_half_fov = Math.max(size.y / zoom, size.x / (zoom * this.camera.aspect));

    this.camera.fov = MathUtils.radToDeg(2 * Math.atan(tan_half_fov));

    // Off center, perspective shows a shape from an angle, so the camera aims
    // at the logo and its lens shifts to frame the whole content instead. A
    // shifted frustum is a crop of a centered one: the logo looks exactly as
    // it would in the middle of the screen.
    this.camera_controller.reference_position.copy(right).multiplyScalar(logo_center.x).addScaledVector(up, logo_center.y);
    this.camera_controller.reference_zoom = zoom;

    const half_height = zoom * tan_half_fov;
    const half_width = half_height * this.camera.aspect;

    this.camera.setViewOffset(
      OScreen.width, OScreen.height,
      (center.x - logo_center.x) / (2 * half_width) * OScreen.width,
      -(center.y - logo_center.y) / (2 * half_height) * OScreen.height,
      OScreen.width, OScreen.height
    );

    // The text is still off center, so it turns to face the camera
    const forward = new Vector3(0, 0, -1).applyQuaternion(this.rest_rotation);
    const camera_position = this.camera_controller.reference_position.clone().addScaledVector(forward, -zoom);

    this.face_camera(this.text_particles, this.text_bounds, text_origin, this.rest_rotation, text_scale, camera_position, forward);
  }

  // Places a shape so its bounds center sits where it would with the given
  // origin, rotation and scale, turned so the camera sees it head on.
  face_camera(object: Object3D, bounds: Box3, origin: Vector3, rotation: Quaternion, scale: number, camera_position: Vector3, forward: Vector3)
  {
    const local_center = bounds.getCenter(new Vector3()).multiplyScalar(scale);
    const center = local_center.clone().applyQuaternion(rotation).add(origin);

    const view_dir = center.clone().sub(camera_position).normalize();
    object.quaternion.setFromUnitVectors(forward, view_dir).multiply(rotation);
    object.position.copy(center).sub(local_center.applyQuaternion(object.quaternion));
  }

  // Bounds of a box seen along the camera's rest forward axis, as x (right) and y (up)
  get_projected_rect(bounds: Box3, right: Vector3, up: Vector3)
  {
    const rect = new Box3();
    const corner = new Vector3();

    for (let i = 0; i < 8; i++)
    {
      corner.set(
        i & 1 ? bounds.max.x : bounds.min.x,
        i & 2 ? bounds.max.y : bounds.min.y,
        i & 4 ? bounds.max.z : bounds.min.z
      );

      rect.expandByPoint(new Vector3(corner.dot(right), corner.dot(up), 0));
    }

    return rect;
  }

  // The camera leans slightly towards the pointer
  update_camera_rotation()
  {
    if (OScreen.portrait)
    {
      if (Input.left_mouse_button_down)
      {
        this.target_NDC.copy(Input.NDC);
      }
    }
    else if (Input.NDC_delta.length() > 0.001)
    {
      this.target_NDC.copy(Input.NDC);
    }

    this.current_NDC.lerp(this.target_NDC, 0.1);

    this.camera_controller.set_rotation(
      CAMERA_TILT - this.current_NDC.y * 2.5,
      CAMERA_ORIENTATION - this.current_NDC.x * 4,
      0
    );
  }

  // Holding the pointer still for a moment counts as a hold (used on touch devices)
  update_hold()
  {
    if (Input.left_mouse_button_pressed)
    {
      this.hold_time = 0;
      this.hold_travel = 0;
    }

    if (Input.left_mouse_button_down)
    {
      this.hold_time += Time.delta_time;
      this.hold_travel += Math.abs(Input.NDC_delta.x) + Math.abs(Input.NDC_delta.y);

      if (this.hold_time > 0.4 && this.hold_travel < 0.001)
      {
        this.holding = true;
      }
    }

    if (Input.left_mouse_button_released)
    {
      this.holding = false;
    }
  }

  is_turbo()
  {
    if (OS.is_mobile || OS.is_ipad)
    {
      return Input.pointer_count > 1 || this.holding;
    }

    return Input.left_mouse_button_down;
  }

  init_camera()
  {
    this.camera = new PerspectiveCamera(CAMERA_FOV, OScreen.aspect_ratio, 0.1, 200);
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 10;

    this.camera.clear_color.copy(new Color('#000000'));
    this.camera.clear_alpha = 1;
  }

  setup_camera()
  {
    CameraManager.current = this.camera;

    // Transitions write their fov into the current scene camera, restore ours
    this.camera.fov = CAMERA_FOV;
    this.camera.updateProjectionMatrix();

    this.camera_controller.set_camera(this.camera);
    this.camera_controller.set_idle();

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 100;
    this.camera_controller.reference_zoom = 15;

    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(CAMERA_TILT, CAMERA_ORIENTATION, 0);

    this.rest_rotation = this.camera_controller.reference_rotation.clone();
  }
}
