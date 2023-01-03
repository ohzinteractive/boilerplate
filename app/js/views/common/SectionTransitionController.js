import { OScreen, ViewManager } from 'ohzi-core';
import { Vector3 } from 'three';
import { Sections } from '../Sections';

import SceneController from '../../components/SceneController';

export default class SectionTransitionController
{
  constructor()
  {
    this.camera_position = new Vector3();
    this.camera_orientation = 0;
    this.camera_tilt = 0;

    this.current_camera_pos = new Vector3();
    this.current_camera_pos_mobile = new Vector3();

    this.current_camera_zoom = 0;
    this.current_camera_zoom_mobile = 0;

    this.current_camera_fov = 40;
    this.current_camera_fov_mobile = 40;
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.loader_view = ViewManager.get(Sections.LOADER);
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.__set_keyframes_offset('camera_x', this.camera_position.x);
    this.__set_keyframes_offset('camera_y', this.camera_position.y);
    this.__set_keyframes_offset('camera_z', this.camera_position.z);

    this.__set_keyframes_offset('camera_x_mobile', this.camera_position.x);
    this.__set_keyframes_offset('camera_y_mobile', this.camera_position.y);
    this.__set_keyframes_offset('camera_z_mobile', this.camera_position.z);

    this.__set_keyframes_offset('camera_orientation', this.camera_orientation);
    this.__set_keyframes_offset('camera_tilt', this.camera_tilt);

    this.__set_keyframes_offset('camera_orientation_mobile', this.camera_orientation);
    this.__set_keyframes_offset('camera_tilt_mobile', this.camera_tilt);
  }

  __set_keyframes_offset(channel_name, offset)
  {
    const action_sequencer = ViewManager.transition_handler.action_sequencer;

    const keyframes = action_sequencer.get_keyframes(channel_name);

    for (let i = 0; i < keyframes.length; i++)
    {
      const keyframe = keyframes[i];

      if (i > 0)
      {
        keyframe.interpolator.from += offset;
      }

      keyframe.interpolator.to += offset;
    }
  }

  show()
  {
    ViewManager.transition_handler.current_state_data.camera_x = SceneController.camera_controller.reference_position.x;
    ViewManager.transition_handler.current_state_data.camera_y = SceneController.camera_controller.reference_position.y;
    ViewManager.transition_handler.current_state_data.camera_z = SceneController.camera_controller.reference_position.z;

    ViewManager.transition_handler.current_state_data.camera_orientation = SceneController.camera_controller.current_orientation;
    ViewManager.transition_handler.current_state_data.camera_tilt = SceneController.camera_controller.current_tilt;
    ViewManager.transition_handler.current_state_data.camera_azimuth = SceneController.camera_controller.current_azimuth;

    ViewManager.transition_handler.current_state_data.camera_zoom = SceneController.camera_controller.reference_zoom;
    ViewManager.transition_handler.current_state_data.camera_fov = SceneController.camera_controller.camera.fov;

    // Mobile
    ViewManager.transition_handler.current_state_data.camera_x_mobile = SceneController.camera_controller.reference_position.x;
    ViewManager.transition_handler.current_state_data.camera_y_mobile = SceneController.camera_controller.reference_position.y;
    ViewManager.transition_handler.current_state_data.camera_z_mobile = SceneController.camera_controller.reference_position.z;

    ViewManager.transition_handler.current_state_data.camera_orientation_mobile = SceneController.camera_controller.current_orientation;
    ViewManager.transition_handler.current_state_data.camera_tilt_mobile = SceneController.camera_controller.current_tilt;
    ViewManager.transition_handler.current_state_data.camera_azimuth_mobile = SceneController.camera_controller.current_azimuth;

    ViewManager.transition_handler.current_state_data.camera_zoom_mobile = SceneController.camera_controller.reference_zoom;
    ViewManager.transition_handler.current_state_data.camera_fov_mobile = SceneController.camera_controller.camera.fov;

    // this.starting_orientation = SceneController.camera_controller.current_orientation;
    // this.starting_tilt = SceneController.camera_controller.current_tilt;
    // this.starting_azimuth = SceneController.camera_controller.current_azimuth;
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
  }

  // This method is called in every frame when the site is transitioning to this section.
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

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }

  set_camera_position(position)
  {
    this.camera_position = position; // .clone();
  }

  set_camera_orientation(orientation)
  {
    this.camera_orientation = orientation;
  }

  set_camera_tilt(tilt)
  {
    this.camera_tilt = tilt;
  }

  __update_camera_rotation(action_sequencer)
  {
    const camera_tilt_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_tilt_mobile') ? '_mobile' : '';
    const camera_orientation_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_orientation_mobile') ? '_mobile' : '';
    const camera_azimuth_suffix = OScreen.portrait && action_sequencer.is_channel_redefined('camera_azimuth_mobile') ? '_mobile' : '';

    SceneController.camera_controller.lerp_tilt(
      action_sequencer.get_current_starting_value(`camera_tilt${camera_tilt_suffix}`),
      action_sequencer.get_current_target_value(`camera_tilt${camera_tilt_suffix}`),
      action_sequencer.get_current_progress(`camera_tilt${camera_tilt_suffix}`)
    );

    SceneController.camera_controller.lerp_orientation(
      action_sequencer.get_current_starting_value(`camera_orientation${camera_orientation_suffix}`),
      action_sequencer.get_current_target_value(`camera_orientation${camera_orientation_suffix}`),
      action_sequencer.get_current_progress(`camera_orientation${camera_orientation_suffix}`)
    );

    SceneController.camera_controller.lerp_azimuth(
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
      SceneController.camera_controller.reference_zoom = this.current_camera_zoom_mobile;
    }
    else
    {
      SceneController.camera_controller.reference_zoom = this.current_camera_zoom;
    }
  }

  __update_camera_pos(action_sequencer)
  {
    const mobile = action_sequencer.is_channel_redefined('camera_x_mobile') ||
      action_sequencer.is_channel_redefined('camera_y_mobile') ||
      action_sequencer.is_channel_redefined('camera_z_mobile');

    if (OScreen.portrait && mobile)
    {
      SceneController.camera_controller.reference_position.copy(this.current_camera_pos_mobile);
    }
    else
    {
      SceneController.camera_controller.reference_position.copy(this.current_camera_pos);
    }
  }

  __update_camera_fov(action_sequencer)
  {
    const mobile = action_sequencer.is_channel_redefined('camera_fov_mobile');

    if (OScreen.portrait && mobile)
    {
      SceneController.camera_controller.camera.fov = this.current_camera_fov_mobile;
    }
    else
    {
      SceneController.camera_controller.camera.fov = this.current_camera_fov;
    }
  }
}
