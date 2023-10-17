import { Sections, SectionsURLs } from '../Sections';

import { TransitionSceneController } from './TransitionSceneController';
import { TransitionTransitionController } from './TransitionTransitionController';

import transition_data from '../../../data/transitions/transition.json';
import { CommonViewController } from '../common/CommonViewController';

import { VCManager, WorkerToMain } from 'ohzi-core';
import { Settings } from '../../Settings';

class TransitionViewController extends CommonViewController
{
  constructor()
  {
    super({
      name: Sections.TRANSITION,
      url: SectionsURLs.TRANSITION,
      transition_data: transition_data
    });

    this.scene_controller = new TransitionSceneController();
    this.transition_controller = new TransitionTransitionController();

    this.next_view_name = '';
  }

  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();
  }

  before_enter()
  {
    super.before_enter();

    this.current_progress = 0;
    this.target_progress = 0;

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
  }

  before_exit()
  {
    super.before_exit();

    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  on_exit()
  {
    super.on_exit();

    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  update()
  {
    WorkerToMain.push(`${this.name}_view.update`, [this.scene_controller.loading_progress]);

    this.scene_controller.update();
    this.transition_controller.update();

    this.__check_section_ready();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    WorkerToMain.push(`${this.name}_view.update_enter_transition`, [global_view_data, transition_progress, this.scene_controller.loading_progress]);

    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    // this.__check_section_ready();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    WorkerToMain.push(`${this.name}_view.update_exit_transition`, [global_view_data, transition_progress, this.scene_controller.loading_progress]);

    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  set_next_view_controller_name(view_controller_name)
  {
    const next_view_controller = VCManager.get(view_controller_name);

    this.scene_controller.set_next_scene(next_view_controller.scene_controller.scene);
    this.next_view_name = next_view_controller.name;
  }

  __check_section_ready()
  {
    if (this.scene_controller.is_ready_to_exit())
    {
      let skip = false;

      if (Settings.debug_mode)
      {
        skip = true;
      }

      WorkerToMain.push('go_to', [this.next_view_name, false, skip]);
    }
  }
}

export { TransitionViewController };
