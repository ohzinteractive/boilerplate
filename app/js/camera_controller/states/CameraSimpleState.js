import CameraViewState from './CameraViewState';

import { Input }  from 'ohzi-core';
import { CameraUtilities }  from 'ohzi-core';

import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { Ray } from 'three';
import SceneController from '../../components/SceneController';

export default class CameraSimpleState extends CameraViewState
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
    this.last_point = new Vector2();

    this.rotation_velocity = new Vector2();

    this.forward_dir = 0;
    this.right_dir = 0;
    this.y_dir = 0;
    this.azimuth_dir = 0;

    if (process.env.NODE_ENV === 'development')
    {
      window.addEventListener('keydown', this.on_key_down.bind(this), false);
      window.addEventListener('keyup', this.on_key_up.bind(this), false);
    }
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
    if (process.env.NODE_ENV === 'development')
    {
      camera_controller.reference_zoom += Input.scroll_delta;

      if (Input.left_mouse_button_pressed)
      {
        this.last_NDC.copy(Input.NDC);
      }
      if (Input.right_mouse_button_pressed)
      {
        this.last_point.copy(Input.NDC);
      }

      if (Input.left_mouse_button_down && Input.pointer_count === 1)
      {
        this.rotation_velocity.add(new Vector2(Input.NDC_delta.x * -16, Input.NDC_delta.y * -4));
      }

      if (Input.right_mouse_button_down) // || (Input.left_mouse_button_down && this.shift_key))
      {
        const prev_point    = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.last_point).clone();
        const current_point = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, Input.NDC).clone();
        current_point.sub(prev_point);

        camera_controller.reference_position.x -= current_point.x;
        camera_controller.reference_position.y -= current_point.y;
        camera_controller.reference_position.z -= current_point.z;
        this.last_point.copy(Input.NDC);
      }

      if (Input.left_mouse_button_released)
      {
        console.log({
          x: camera_controller.reference_position.x,
          y: camera_controller.reference_position.y,
          z: camera_controller.reference_position.z,
          orientation: camera_controller.current_orientation,
          tilt: camera_controller.current_tilt,
          azimuth: camera_controller.current_azimuth,
          zoom: camera_controller.reference_zoom,
          fov: camera_controller.camera.fov
        });
      }

      camera_controller.set_rotation_delta(this.rotation_velocity.y, this.rotation_velocity.x);

      camera_controller.translate_forward(this.forward_dir);
      camera_controller.translate_right(this.right_dir);

      camera_controller.reference_position.y -= this.y_dir;
      camera_controller.set_rotation_delta(0, 0, this.azimuth_dir);

      this.rotation_velocity.multiplyScalar(0.9);

      this.last_NDC.copy(Input.NDC);
    }
  }

  on_key_down(event)
  {
    switch (event.key)
    {
    case 'w':
      this.forward_dir = -0.03;
      break;
    case 's':
      this.forward_dir = 0.03;
      break;
    case 'a':
      this.right_dir = -0.03;
      break;
    case 'd':
      this.right_dir = 0.03;
      break;
    case 'q':
      this.azimuth_dir = 0.1;
      break;
    case 'e':
      this.azimuth_dir = -0.1;
      break;
    case 'z':
      this.y_dir = 0.03;
      break;
    case 'c':
      this.y_dir = -0.03;
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
    console.log({
      x: SceneController.camera_controller.reference_position.x,
      y: SceneController.camera_controller.reference_position.y,
      z: SceneController.camera_controller.reference_position.z,
      orientation: SceneController.camera_controller.current_orientation,
      tilt: SceneController.camera_controller.current_tilt,
      azimuth: SceneController.camera_controller.current_azimuth,
      zoom: SceneController.camera_controller.reference_zoom,
      fov: SceneController.camera_controller.camera.fov
    });

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
    case 'q':
      this.azimuth_dir = 0;
      break;
    case 'e':
      this.azimuth_dir = 0;
      break;
    case 'z':
      this.y_dir = 0;
      break;
    case 'c':
      this.y_dir = 0;
      break;
    case 'Shift':
      this.shift_key = false;
      break;
    default:
      break;
    }
  }
}
