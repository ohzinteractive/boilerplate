import CameraViewState from './CameraViewState';

import { Input }  from 'ohzi-core';
import { CameraUtilities } from 'ohzi-core';

import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { Ray } from 'three';

export default class CameraDebugState extends CameraViewState
{
  constructor(oobb)
  {
    super();
    this.pan_speed = new Vector2();

    this.zoom_speed = 0;
    this.zoom_t = 0;

    this.tilt_degrees = 70;
    this.tilt_speed = 0;

    this.vector_down_axis = new Vector3(0, -1, 0);
    this.vector_up_axis   = new Vector3(0, 1, 0);
    this.vector_back_axis = new Vector3(0, 0, -1);
    this.vector_left_axis = new Vector3(-1, 0, 0);

    this.tmp_dir = new Vector3();
    this.tmp_ray = new Ray();

    this.tmp_intersection = new Vector3();
    this.tmp_mouse_dir = new Vector2();

    this.last_point = new Vector3();

    this.last_NDC = new Vector2();
  }

  on_enter(camera_controller)
  {
    this.t_damping = 0;
  }

  on_exit(camera_controller)
  {
  }

  update(camera_controller)
  {
    if (!camera_controller.input_enabled)
    {
      return;
    }

    if (camera_controller.camera.isOrthographicCamera)
    {
      camera_controller.reference_zoom += Input.wheel_delta * 0.5;
    }
    else
    {
      camera_controller.reference_zoom += Input.wheel_delta * 0.5;
    }

    if (Input.left_mouse_button_pressed || Input.right_mouse_button_pressed)
    {
      this.last_point.copy(Input.NDC);
      this.last_NDC.copy(Input.NDC);
    }

    if (Input.left_mouse_button_down)
    {
      let mouse_delta_dir = Input.NDC.clone().sub(this.last_NDC);

      camera_controller.set_rotation_delta(mouse_delta_dir.x * -200,
        mouse_delta_dir.y * -200);
    }

    if (Input.right_mouse_button_down)
    {
      let prev_point    = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.last_point).clone();
      let current_point = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, Input.NDC).clone();
      current_point.sub(prev_point);

      camera_controller.reference_position.x -= current_point.x;
      camera_controller.reference_position.y -= current_point.y;
      camera_controller.reference_position.z -= current_point.z;
      this.last_point.copy(Input.NDC);
    }

    this.last_NDC.copy(Input.NDC);
  }
}
