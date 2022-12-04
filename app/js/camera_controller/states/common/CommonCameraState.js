
import { Input }  from 'ohzi-core';
import { CameraUtilities }  from 'ohzi-core';

import { Vector2 } from 'three';

import AbstractCameraState from './AbstractCameraState';

export default class CommonCameraState extends AbstractCameraState
{
  constructor()
  {
    super();

    // this.vector_down_axis = new Vector3(0, -1, 0);
    // this.vector_up_axis   = new Vector3(0, 1, 0);
    // this.vector_back_axis = new Vector3(0, 0, -1);
    // this.vector_left_axis = new Vector3(-1, 0, 0);

    this.last_point = new Vector2();

    this.rotation_velocity = new Vector2();

    this.forward_dir = 0;
    this.right_dir = 0;
    this.y_dir = 0;
    this.azimuth_dir = 0;

    this.shift_key = false;
  }

  on_enter(camera_controller)
  {
  }

  on_exit(camera_controller)
  {
  }

  update(camera_controller)
  {
    this.__check_key_down();
    this.__check_key_up();

    // this.__move_camera(camera_controller);
    // this.__zoom_camera(camera_controller);
    // this.__rotate_camera(camera_controller);
  }

  __show_camera_position(camera_controller)
  {
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
  }

  __zoom_camera(camera_controller)
  {
    camera_controller.reference_zoom += Input.zoom_delta;
  }

  __rotate_camera(camera_controller)
  {
    if (Input.left_mouse_button_down && Input.pointer_count === 1)
    {
      this.rotation_velocity.add(new Vector2(Input.NDC_delta.x * -16, Input.NDC_delta.y * -4));
    }

    camera_controller.set_rotation_delta(this.rotation_velocity.y, this.rotation_velocity.x);
    camera_controller.set_rotation_delta(0, 0, this.azimuth_dir);

    this.rotation_velocity.multiplyScalar(0.9);
  }

  __move_camera(camera_controller)
  {
    camera_controller.translate_forward(this.forward_dir);
    camera_controller.translate_right(this.right_dir);

    camera_controller.reference_position.y -= this.y_dir;

    if (Input.right_mouse_button_pressed)
    {
      this.last_point.copy(Input.NDC);
    }

    if (Input.right_mouse_button_down) // || (Input.left_mouse_button_down && this.shift_key)
    {
      const prev_point    = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.last_point).clone();
      const current_point = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, Input.NDC).clone();
      current_point.sub(prev_point);

      camera_controller.reference_position.x -= current_point.x;
      camera_controller.reference_position.y -= current_point.y;
      camera_controller.reference_position.z -= current_point.z;
      this.last_point.copy(Input.NDC);
    }
  }

  __check_key_down()
  {
    const speed = 0.06;

    if (Input.keyboard.is_key_down('w'))
    {
      this.forward_dir = -speed;
    }
    if (Input.keyboard.is_key_down('s'))
    {
      this.forward_dir = speed;
    }
    if (Input.keyboard.is_key_down('a'))
    {
      this.right_dir = -speed;
    }
    if (Input.keyboard.is_key_down('d'))
    {
      this.right_dir = speed;
    }
    if (Input.keyboard.is_key_down('q'))
    {
      this.azimuth_dir = speed * 4;
    }
    if (Input.keyboard.is_key_down('e'))
    {
      this.azimuth_dir = -speed * 4;
    }
    if (Input.keyboard.is_key_down('z'))
    {
      this.y_dir = speed;
    }
    if (Input.keyboard.is_key_down('c'))
    {
      this.y_dir = -speed;
    }
    if (Input.keyboard.is_key_down('Shift'))
    {
      this.shift_key = true;
    }
  }

  __check_key_up()
  {
    if (Input.keyboard.is_key_released('w'))
    {
      this.forward_dir = 0;
    }
    if (Input.keyboard.is_key_released('s'))
    {
      this.forward_dir = 0;
    }
    if (Input.keyboard.is_key_released('a'))
    {
      this.right_dir = 0;
    }
    if (Input.keyboard.is_key_released('d'))
    {
      this.right_dir = 0;
    }
    if (Input.keyboard.is_key_released('q'))
    {
      this.azimuth_dir = 0;
    }
    if (Input.keyboard.is_key_released('e'))
    {
      this.azimuth_dir = 0;
    }
    if (Input.keyboard.is_key_released('z'))
    {
      this.y_dir = 0;
    }
    if (Input.keyboard.is_key_released('c'))
    {
      this.y_dir = 0;
    }
    if (Input.keyboard.is_key_released('Shift'))
    {
      this.shift_key = false;
    }
  }
}
