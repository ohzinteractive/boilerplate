import { OScreen, SceneManager, TransitionManager } from 'ohzi-core';
import { Vector3 } from 'three';

class SectionTransitionController
{
  constructor()
  {
    this.current_camera_pos = new Vector3();
    this.current_camera_pos_mobile = new Vector3();

    this.current_camera_zoom = 0;
    this.current_camera_zoom_mobile = 0;

    this.current_camera_fov = 40;
    this.current_camera_fov_mobile = 40;
  }

  start()
  {
  }

  before_enter()
  {
    TransitionManager.current_state_data.camera_x = SceneManager.current.camera_controller.reference_position.x;
    TransitionManager.current_state_data.camera_y = SceneManager.current.camera_controller.reference_position.y;
    TransitionManager.current_state_data.camera_z = SceneManager.current.camera_controller.reference_position.z;

    TransitionManager.current_state_data.camera_orientation = SceneManager.current.camera_controller.current_orientation;
    TransitionManager.current_state_data.camera_tilt = SceneManager.current.camera_controller.current_tilt;
    TransitionManager.current_state_data.camera_azimuth = SceneManager.current.camera_controller.current_azimuth;

    TransitionManager.current_state_data.camera_zoom = SceneManager.current.camera_controller.reference_zoom;
    TransitionManager.current_state_data.camera_fov = SceneManager.current.camera_controller.camera.fov;

    // Mobile
    TransitionManager.current_state_data.camera_x_mobile = SceneManager.current.camera_controller.reference_position.x;
    TransitionManager.current_state_data.camera_y_mobile = SceneManager.current.camera_controller.reference_position.y;
    TransitionManager.current_state_data.camera_z_mobile = SceneManager.current.camera_controller.reference_position.z;

    TransitionManager.current_state_data.camera_orientation_mobile = SceneManager.current.camera_controller.current_orientation;
    TransitionManager.current_state_data.camera_tilt_mobile = SceneManager.current.camera_controller.current_tilt;
    TransitionManager.current_state_data.camera_azimuth_mobile = SceneManager.current.camera_controller.current_azimuth;

    TransitionManager.current_state_data.camera_zoom_mobile = SceneManager.current.camera_controller.reference_zoom;
    TransitionManager.current_state_data.camera_fov_mobile = SceneManager.current.camera_controller.camera.fov;

    // this.starting_orientation = SceneManager.current.camera_controller.current_orientation;
    // this.starting_tilt = SceneManager.current.camera_controller.current_tilt;
    // this.starting_azimuth = SceneManager.current.camera_controller.current_azimuth;
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.current_camera_pos.set(global_view_data.camera_x, global_view_data.camera_y, global_view_data.camera_z);
    this.current_camera_pos_mobile.set(global_view_data.camera_x_mobile, global_view_data.camera_y_mobile, global_view_data.camera_z_mobile);

    this.current_camera_zoom = global_view_data.camera_zoom;
    this.current_camera_zoom_mobile = global_view_data.camera_zoom_mobile;

    this.current_camera_fov = global_view_data.camera_fov;
    this.current_camera_fov_mobile = global_view_data.camera_fov_mobile;

    this.__update_camera_pos(action_sequencer);
    this.__update_camera_zoom(action_sequencer);
    this.__update_camera_rotation(action_sequencer);
    this.__update_camera_fov(action_sequencer);

    // DatGUI.galaxy.opacity = Math.pow(global_view_data.galaxy_scale, 5)
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }

  __update_camera_rotation(action_sequencer)
  {
    const camera_tilt_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_tilt_mobile') ? '_mobile' : '';
    const camera_orientation_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_orientation_mobile') ? '_mobile' : '';
    const camera_azimuth_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_azimuth_mobile') ? '_mobile' : '';

    SceneManager.current.camera_controller.lerp_tilt(
      action_sequencer.get_current_starting_value(`camera_tilt${camera_tilt_suffix}`),
      action_sequencer.get_current_target_value(`camera_tilt${camera_tilt_suffix}`),
      action_sequencer.get_current_progress(`camera_tilt${camera_tilt_suffix}`)
    );

    SceneManager.current.camera_controller.lerp_orientation(
      action_sequencer.get_current_starting_value(`camera_orientation${camera_orientation_suffix}`),
      action_sequencer.get_current_target_value(`camera_orientation${camera_orientation_suffix}`),
      action_sequencer.get_current_progress(`camera_orientation${camera_orientation_suffix}`)
    );

    SceneManager.current.camera_controller.lerp_azimuth(
      action_sequencer.get_current_starting_value(`camera_azimuth${camera_azimuth_suffix}`),
      action_sequencer.get_current_target_value(`camera_azimuth${camera_azimuth_suffix}`),
      action_sequencer.get_current_progress(`camera_azimuth${camera_azimuth_suffix}`)
    );
  }

  __update_camera_zoom(action_sequencer)
  {
    const mobile = action_sequencer.is_channel_redefined('camera_zoom_mobile');

    if (OScreen.portrait && mobile)
    {
      SceneManager.current.camera_controller.reference_zoom = this.current_camera_zoom_mobile;
    }
    else
    {
      SceneManager.current.camera_controller.reference_zoom = this.current_camera_zoom;
    }
  }

  __update_camera_pos(action_sequencer)
  {
    const mobile = action_sequencer.is_channel_redefined('camera_x_mobile') ||
      action_sequencer.is_channel_redefined('camera_y_mobile') ||
      action_sequencer.is_channel_redefined('camera_z_mobile');

    if (OScreen.portrait && mobile)
    {
      SceneManager.current.camera_controller.reference_position.copy(this.current_camera_pos_mobile);
    }
    else
    {
      SceneManager.current.camera_controller.reference_position.copy(this.current_camera_pos);
    }
  }

  __update_camera_fov(action_sequencer)
  {
    const mobile = action_sequencer.is_channel_redefined('camera_fov_mobile');

    if (OScreen.portrait && mobile)
    {
      SceneManager.current.camera_controller.camera.fov = this.current_camera_fov_mobile;
    }
    else
    {
      SceneManager.current.camera_controller.camera.fov = this.current_camera_fov;
    }
  }
}

export { SectionTransitionController };
