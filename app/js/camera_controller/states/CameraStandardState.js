import CameraViewState from './CameraViewState';

import { Input }  from 'ohzi-core';

import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { Ray, Math as TMath } from 'three';

export default class CameraStandardState extends CameraViewState
{
  constructor()
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

    this.last_NDC = new Vector2();

    this.rotation_velocity = new Vector2();

    if (process.env.NODE_ENV === 'development')
    {
      window.addEventListener('keydown', this.on_key_down.bind(this), false);
      window.addEventListener('keyup', this.on_key_up.bind(this), false);
    }

    this.forward_dir = 0;
    this.right_dir = 0;
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

    // camera_controller.reference_zoom += Input.scroll_delta * 0.5;

    camera_controller.camera.fov += Input.scroll_delta * 2;
    camera_controller.camera.fov = TMath.clamp(camera_controller.camera.fov, 3, 80);

    if (Input.left_mouse_button_pressed)
    {
      this.last_NDC.copy(Input.NDC);
    }

    if (Input.left_mouse_button_down && Input.pointer_count === 1)
    {
      this.rotation_velocity.add(new Vector2(Input.NDC_delta.x * -16, Input.NDC_delta.y * -4));
    }

    camera_controller.set_rotation_delta(this.rotation_velocity.x, this.rotation_velocity.y);

    camera_controller.translate_forward(this.forward_dir);
    camera_controller.translate_right(this.right_dir);

    this.rotation_velocity.multiplyScalar(0.9);

    this.last_NDC.copy(Input.NDC);
  }

  on_key_down(event)
  {
    switch (event.key)
    {
    case 'w':
      this.forward_dir = -0.2;
      break;
    case 's':
      this.forward_dir = 0.2;
      break;
    case 'a':
      this.right_dir = -0.2;
      break;
    case 'd':
      this.right_dir = 0.2;
      break;
    case 'Shift':
      this.shift_key = true;
      break;
    default:
      break;
    }
  }

  on_key_up(event)
  {
    switch (event.key)
    {
    case 'w':
      this.forward_dir = 0;
      break;
    case 's':
      this.forward_dir = 0;
      break;
    case 'a':
      this.right_dir = 0;
      break;
    case 'd':
      this.right_dir = 0;
      break;
    case 'Shift':
      this.shift_key = false;
      break;
    default:
      break;
    }
  }
}
