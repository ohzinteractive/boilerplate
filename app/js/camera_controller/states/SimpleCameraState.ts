import type { CameraController } from 'ohzi-core';
import { CommonCameraState } from 'ohzi-core';
import { Input } from '../../components/Input';

export class SimpleCameraState extends CommonCameraState
{
  update(camera_controller: CameraController)
  {
    super.update(camera_controller);

    if (Input.over_ui) return;

    this.__move_camera(camera_controller);
    this.__zoom_camera(camera_controller);
    this.__rotate_camera(camera_controller);
    // this.__show_camera_position(camera_controller);
  }
}
