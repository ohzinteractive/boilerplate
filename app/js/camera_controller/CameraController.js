import CameraViewState from './states/CameraViewState';
import ImmediateMode from './movement_mode/ImmediateMode';

import { Screen } from 'ohzi-core';
// import { Debug } from 'ohzi-core';
import { OMath } from 'ohzi-core';
// import { SceneManager } from 'ohzi-core';
import { PerspectiveFrustumPointFitter } from 'ohzi-core';
import { OrthographicFrustumPointFitter } from 'ohzi-core';

import { Vector3 } from 'three';
import { Quaternion } from 'three';
// import { PlaneHelper } from 'three';
import { Plane } from 'three';
// import { Sphere } from 'three';
import { Box3 } from 'three';
import { Ray } from 'three';
import { Math as TMath } from 'three';

import CameraSimpleState from './states/CameraSimpleState';

export default class CameraController
{
  constructor()
  {
    this.camera = undefined;
    this.camera_initial_rot = undefined;
    this.camera_initial_pos = undefined;
    this.current_state = new CameraViewState();

    this.current_mode = new ImmediateMode();

    this.point_of_interest = new Vector3();
    this.normalized_zoom = 0;

    this.vector_up_axis   = new Vector3(0, 1, 0);
    this.vector_right_axis = new Vector3(1, 0, 0);
    this.vector_forward_axis = new Vector3(0, 0, 1);
    this.tmp_forward = this.vector_forward_axis.clone();
    this.tmp_right = this.vector_right_axis.clone();

    this.tmp_dir = new Vector3();

    this.zoom = 10;
    this.reference_zoom = 10;
    this.orientation = 27; // degrees
    this.tilt = 70;

    this.reference_rotation = new Quaternion();
    this.reference_position = new Vector3();
    this.__last_reference_position = new Vector3();

    this.tmp_size = new Vector3();
    this.tmp_quat = new Quaternion();

    this.min_zoom = 1;
    this.max_zoom = 400;

    this.current_tilt = 0;
    this.current_orientation = 0;
    this.current_azimuth = 0;

    this.input_enabled = true;
    // this.debug_box = Debug.draw_cube(undefined,15);
    // this.debug_zoom_box = Debug.draw_sphere(undefined,15, 0x00ff00);

    this.raised_look_at_position = new Vector3(-82.2986094900191, 0, 39.7538467209173);
    this.use_raised_look_at_direction = 0;
  }

  enable()
  {
    this.input_enabled = true;
  }

  disable()
  {
    this.input_enabled = false;
  }

  set_camera(camera)
  {
    this.camera = camera;
    this.camera_initial_rot = camera.quaternion.clone();
    this.camera_initial_pos = camera.position.clone();
  }

  set_state(state)
  {
    // console.log("camera controller state switch to: " + state.constructor.name);
    this.current_state.on_exit(this);
    this.current_state = state;
    this.current_state.on_enter(this);
  }

  set_mode(mode)
  {
    // console.log("camera controller mode switch to: " + mode.constructor.name);

    this.current_mode.on_exit(this);
    this.current_mode = mode;
    this.current_mode.on_enter(this);
  }

  set_normalized_zoom(zoom)
  {
    this.normalized_zoom = TMath.clamp(zoom, 0, 1);
    // EventManager.fire_zoom_changed(this.normalized_zoom);
  }

  update_normalized_zoom(min_zoom, max_zoom)
  {
    const zoom = this.camera.position.distanceTo(this.reference_position);
    this.normalized_zoom = OMath.linear_map(zoom, min_zoom, max_zoom, 1, 0);
    this.normalized_zoom = TMath.clamp(this.normalized_zoom, 0, 1);

    // EventManager.fire_zoom_changed(this.normalized_zoom);
  }

  update_initial_rotation()
  {
    this.current_state.update_initial_rotation();
  }

  update()
  {
    if (this.debug_box)
    {
      this.debug_box.position.copy(this.reference_position);
    }

    // this.debug_zoom_box.position.copy(this.reference_position)
    // this.debug_zoom_box.position.add(new Vector3(0,0,1).applyQuaternion(this.camera.quaternion).multiplyScalar(this.reference_zoom));

    this.current_state.update(this);
    this.current_mode.update(this);
    this.update_normalized_zoom(this.min_zoom, this.max_zoom);
  }

  set_idle()
  {
    this.set_state(new CameraViewState());
  }

  camera_is_zoomed_out()
  {
    return this.normalized_zoom < 0.2;
  }

  set_standard_mode()
  {
    this.set_state(new CameraSimpleState());
  }

  set_rotation(tilt, orientation, azimuth = 0)
  {
    this.old_orientation = this.current_orientation;

    this.current_tilt = tilt || this.current_tilt;
    this.current_orientation = orientation || this.current_orientation;
    this.current_azimuth = azimuth || this.current_azimuth;

    this.reference_rotation.copy(this.build_rotation(this.current_tilt, this.current_orientation, this.current_azimuth));
  }

  // set_tilt(tilt)
  // {
  //   const new_tilt = new Quaternion().setFromAxisAngle(this.vector_right_axis, (-tilt / 360) * Math.PI * 2);
  //   const old_tilt = new Quaternion().setFromAxisAngle(this.vector_right_axis, (-this.current_tilt / 360) * Math.PI * 2);
  //   old_tilt.conjugate();

  //   this.reference_rotation.multiply(old_tilt).multiply(new_tilt);
  //   this.current_tilt = tilt;
  // }

  set_rotation_delta(tilt, orientation, azimuth = 0)
  {
    this.lerp_rotation(
      this.current_tilt, this.current_tilt + tilt,
      this.current_orientation, this.current_orientation + orientation,
      this.current_azimuth, this.current_azimuth + azimuth,
      1
    );
    // this.current_orientation = OMath.mod(this.current_orientation + delta_x,  360);
    // this.current_tilt = OMath.mod(this.current_tilt + delta_y,  360);
    // this.current_azimuth = OMath.mod(this.current_azimuth + delta_z,  360);

    // this.set_rotation(this.current_tilt, this.current_orientation, this.current_azimuth);
  }

  lerp_tilt(from_tilt, to_tilt, t)
  {
    // if (Math.abs(to_tilt - from_tilt) > 180)
    // {
    //   if (from_tilt > 180)
    //   {
    //     from_tilt = (from_tilt % 360) - 360;
    //     from_tilt = OMath.mod(OMath.mod(from_tilt, 360) - 360, 360);
    //   }
    //   if (to_tilt > 180)
    //   {
    //     to_tilt = OMath.mod(OMath.mod(to_tilt, 360) - 360, 360);
    //   }
    // }

    this.set_rotation(TMath.lerp(from_tilt, to_tilt, t), this.current_orientation, this.current_azimuth);
    this.current_tilt = TMath.lerp(from_tilt, to_tilt, t);
  }

  lerp_orientation(from_orientation, to_orientation, t)
  {
    if (Math.abs(to_orientation - from_orientation) > 180)
    {
      if (from_orientation > 180)
      {
        from_orientation = (from_orientation % 360) - 360;
        from_orientation = OMath.mod(OMath.mod(from_orientation, 360) - 360, 360);
      }
      if (to_orientation > 180)
      {
        to_orientation = OMath.mod(OMath.mod(to_orientation, 360) - 360, 360);
      }
    }

    this.set_rotation(this.current_tilt, TMath.lerp(from_orientation, to_orientation, t), this.current_azimuth);
    this.current_orientation = TMath.lerp(from_orientation, to_orientation, t);
  }

  lerp_azimuth(from_azimuth, to_azimuth, t)
  {
    // if (Math.abs(to_azimuth - from_azimuth) > 180)
    // {
    //   if (from_azimuth > 180)
    //   {
    //     from_azimuth = (from_azimuth % 360) - 360;
    //     from_azimuth = OMath.mod(OMath.mod(from_azimuth, 360) - 360, 360);
    //   }
    //   if (to_azimuth > 180)
    //   {
    //     to_azimuth = OMath.mod(OMath.mod(to_azimuth, 360) - 360, 360);
    //   }
    // }

    this.set_rotation(this.current_tilt, this.current_orientation, TMath.lerp(from_azimuth, to_azimuth, t));
    this.current_azimuth = TMath.lerp(from_azimuth, to_azimuth, t);
  }

  lerp_rotation(from_tilt, to_tilt, from_orientation, to_orientation, from_azimuth, to_azimuth, t)
  {
    this.lerp_tilt(from_tilt, to_tilt, t);
    this.lerp_orientation(from_orientation, to_orientation, t);
    this.lerp_azimuth(from_azimuth, to_azimuth, t);

    // this.set_rotation(
    //   TMath.lerp(from_tilt, to_tilt, t),
    //   TMath.lerp(from_orientation, to_orientation, t),
    //   TMath.lerp(from_azimuth, to_azimuth, t)
    // );

    // this.current_tilt = TMath.lerp(from_tilt, to_tilt, t);
    // this.current_orientation = TMath.lerp(from_orientation, to_orientation, t);
    // this.current_azimuth = TMath.lerp(from_azimuth, to_azimuth, t);
  }

  build_rotation(tilt, orientation, azimuth)
  {
    const new_orientation = new Quaternion().setFromAxisAngle(this.vector_up_axis, (orientation / 360) * Math.PI * 2);
    const new_tilt = new Quaternion().setFromAxisAngle(this.vector_right_axis, (-tilt / 360) * Math.PI * 2);
    const new_azimuth = new Quaternion().setFromAxisAngle(this.vector_forward_axis, (azimuth / 360) * Math.PI * 2);

    return new_orientation.multiply(new_tilt).multiply(new_azimuth);
  }

  translate_forward(amount)
  {
    this.tmp_forward.copy(this.vector_forward_axis);
    this.tmp_forward.applyQuaternion(this.camera.quaternion);
    // this.tmp_forward.y = 0;
    // this.tmp_forward.normalize();
    this.reference_position.add(this.tmp_forward.multiplyScalar(amount));
  }

  translate_right(amount)
  {
    this.tmp_right.copy(this.vector_right_axis);
    this.tmp_right.applyQuaternion(this.camera.quaternion);
    this.reference_position.add(this.tmp_right.multiplyScalar(amount));
  }

  focus_on_bounding_box(bb, scale = 1)
  {
    if (this.camera.isOrthographicCamera)
    {
      bb.getSize(this.tmp_size);

      const obj_x = this.tmp_size.x;
      const obj_y = this.tmp_size.y;
      const object_aspect = obj_x / obj_y;
      if (Screen.aspect_ratio / object_aspect > 1)
      {
        this.camera.zoom = Screen.height / obj_y;
      }
      else
      {
        this.camera.zoom = Screen.width / obj_x;
      }

      bb.getCenter(this.reference_position);
    }
    else
    {
      const dir = new Vector3();
      dir.copy(bb.max).sub(bb.min);

      const p1 = bb.min.clone();

      const p2 = p1.clone().add(new Vector3(dir.x, 0, 0));
      const p3 = p1.clone().add(new Vector3(0, dir.y, 0));
      const p4 = p1.clone().add(new Vector3(0, 0, dir.z));

      const p5 = p1.clone().add(new Vector3(dir.x, 0, dir.z));
      const p6 = p1.clone().add(new Vector3(0, dir.y, dir.z));
      const p7 = bb.max.clone();
      const p8 = p1.clone().add(new Vector3(dir.x, dir.y, 0));

      this.focus_camera_on_points([p1, p2, p3, p4, p5, p6, p7, p8], scale);
    }
  }

  // get_zoom_to_focus_on_bounding_box(bb, tilt, orientation)
  // {
  //   if (tilt !== undefined && orientation !== undefined)
  //   {
  //     this.tmp_quat.copy(this.reference_rotation); // backup quaternion
  //     this.reference_rotation.copy(this.build_rotation(tilt, orientation, this.current_azimuth));
  //   }
  //   const original_zoom = this.reference_zoom;
  //   const original_pos = new Vector3().copy(this.reference_position);
  //   this.focus_camera_on_bounding_box(bb);
  //   const target_zoom = this.reference_zoom;
  //   this.reference_position.copy(original_pos);
  //   this.reference_zoom = original_zoom;

  //   if (tilt !== undefined && orientation !== undefined)
  //   {
  //     this.reference_rotation.copy(this.tmp_quat);
  //   }

  //   return target_zoom;
  // }

  get_zoom_to_focus_on_points(points, scale)
  {
    const old_zoom = this.reference_zoom;
    const old_pos = new Vector3().copy(this.reference_position);
    this.focus_camera_on_points(points, scale);
    const new_zoom = this.reference_zoom;
    this.reference_zoom = old_zoom;
    this.reference_position.copy(old_pos);
    return new_zoom;
  }

  get_target_pos_to_focus_on_points(points, scale)
  {
    const old_zoom = this.reference_zoom;
    const old_pos = new Vector3().copy(this.reference_position);
    this.focus_camera_on_points(points, scale);
    const new_pos = this.reference_zoom.clone();
    this.reference_zoom = old_zoom;
    this.reference_position.copy(old_pos);
    return new_pos;
  }

  focus_camera_on_sphere(sphere, debug)
  {
    this.reference_zoom = this.get_zoom_to_sphere(sphere, debug);
    this.reference_position.copy(sphere.center);
  }

  get_zoom_to_sphere(sphere, debug)
  {
    const v_fov = (this.camera.fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * this.camera.aspect)) / 2;

    // if(debug )
    // {
    //   Debug.draw_math_sphere(sphere);
    // }
    // this.camera.zoom = 1/((sphere.radius*2) /(ViewApi.map.camera_controller.camera.top*2));
    // this.camera.updateProjectionMatrix();

    const distV = sphere.radius / Math.tan(v_fov);
    const distH = sphere.radius / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  hide_projected_points()
  {
    for (let i = 0; i < this.projected_points.length; i++)
    {
      this.projected_points[i].visible = false;
    }
  }

  show_projected_points(points)
  {
    this.hide_projected_points();
    for (let i = 0; i < points.length; i++)
    {
      this.projected_points[i].visible = true;
      this.projected_points[i].position.copy(points[i]);
    }
  }

  show_plane_projection(plane, size = 1)
  {
    this.projection_plane_helper.plane = plane;
    this.projection_plane_helper.size = size;
    this.projection_plane_helper.updateMatrixWorld();
    this.projection_plane_helper.visible = true;
  }

  show_sphere_projection(sphere)
  {
    this.projection_sphere_helper.scale.set(sphere.radius, sphere.radius, sphere.radius);
    this.projection_sphere_helper.position.copy(sphere.center);
    this.projection_sphere_helper.visible = true;
  }

  focus_camera_on_points(points, zoom_scale = 1)
  {
    if (this.camera.isPerspectiveCamera)
    {
      const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(this.reference_rotation);
      const camera_backward_dir = camera_forward_dir.clone().multiplyScalar(-1);

      const fitter = new PerspectiveFrustumPointFitter();

      const aspect_ratio = Screen.aspect_ratio;

      const camera_pos = fitter.fit_points(points, this.reference_rotation, this.camera.fov * zoom_scale, aspect_ratio);
      const box = new Box3().setFromPoints(points);
      const center = new Vector3();
      box.getCenter(center);

      const reference_position_plane = new Plane().setFromNormalAndCoplanarPoint(camera_backward_dir, center);

      const camera_ray = new Ray(camera_pos, camera_forward_dir);

      const reference_position = new Vector3();
      camera_ray.intersectPlane(reference_position_plane, reference_position);

      const zoom = camera_pos.distanceTo(reference_position);

      this.reference_zoom = zoom;
      this.reference_position.copy(reference_position);
    }
    else
    {
      const fitter = new OrthographicFrustumPointFitter();
      const result = fitter.fit_points(points, this.reference_rotation, this.camera.fov * zoom_scale, Screen.aspect_ratio);

      this.reference_position.copy(result.center);
      this.reference_zoom = result.distance_to_center;
    }
  }

  get_current_tilt()
  {
    return this.current_tilt;
  }

  get_current_orientation()
  {
    return this.current_orientation;
  }

  get_current_azimuth()
  {
    return this.current_azimuth;
  }

  __get_zoom_to_show_rect(width, height, scale = 1)
  {
    // let v_fov = (this.camera.fov/2) * Math.PI/180;
    const v_fov = TMath.degToRad(this.camera.fov / 2);
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * this.camera.aspect)) / 2;

    const distV = height / Math.tan(v_fov * scale);
    const distH = width / Math.tan(h_fov * scale);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }
}
