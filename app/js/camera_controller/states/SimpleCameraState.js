import { CommonCameraState } from './common/CommonCameraState';

class SimpleCameraState extends CommonCameraState
{
  update(camera_controller)
  {
    super.update(camera_controller);

    this.__move_camera(camera_controller);
    this.__zoom_camera(camera_controller);
    this.__rotate_camera(camera_controller);
    // this.__show_camera_position(camera_controller);
  }
}

export { SimpleCameraState };
