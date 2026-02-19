import type { ActionSequencer } from 'ohzi-core';
import { OMath, ViewManager } from 'ohzi-core';
import { Sections, SectionsURLs } from '../Sections';
import { CommonView } from '../common/CommonView';

import { Settings } from '../../Settings';
import { TransitionSceneController } from './TransitionSceneController';
import { TransitionTransitionController } from './TransitionTransitionController';

import transition_data from '../../../data/transitions/transition.json';

export class TransitionView extends CommonView
{
  current_progress: number;
  next_view_name: string;
  progress_bar: HTMLElement;
  scene_controller: TransitionSceneController;
  target_progress: number;

  constructor()
  {
    super({
      name: Sections.TRANSITION,
      url: SectionsURLs.TRANSITION,
      container: document.querySelector('.transition'),
      transition_data: transition_data
    });

    this.scene_controller = new TransitionSceneController();
    this.transition_controller = new TransitionTransitionController();

    this.next_view_name = '';

    this.current_progress = 0;
    this.target_progress = 0;
  }

  start()
  {
    super.start();

    this.scene_controller.start();
    this.transition_controller.start();

    this.progress_bar = document.querySelector('.transition__progress-bar-fill');
  }

  before_enter()
  {
    super.before_enter();

    this.current_progress = 0;
    this.target_progress = 0;

    this.scene_controller.before_enter();
    this.transition_controller.before_enter();

    // HTMLUtilities.load_images(this.container);
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
    this.scene_controller.update();
    this.transition_controller.update();

    this.__check_section_ready();
    this.__update_progress();
  }

  update_enter_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    // this.__check_section_ready();
    this.__update_progress();
  }

  update_exit_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.__update_progress();
  }

  set_next_view(view: CommonView, reload = false)
  {
    if (reload)
    {
      localStorage.setItem('next_view', view.name);
      window.location.reload();
    }
    else
    {
      this.scene_controller.set_next_scene(view.scene_controller.scene);
      this.next_view_name = view.name;
    }
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

      if (this.next_view_name !== Sections.TRANSITION)
      {
        ViewManager.go_to_view(this.next_view_name, false, skip);
      }
    }
  }

  __update_progress()
  {
    const next_progress = this.__round(this.scene_controller.loading_progress, 2);
    this.target_progress = next_progress < this.target_progress ? this.target_progress : next_progress;

    this.current_progress += (this.target_progress - this.current_progress) * 0.05;
    this.current_progress = OMath.clamp(this.current_progress, 0.2, 1);

    this.progress_bar.style.transform = `translate3d(${this.current_progress * 100}%,0,0)`;
  }

  __round(value: number, precision: number)
  {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
