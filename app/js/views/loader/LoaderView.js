import { OMath } from 'ohzi-core';
import { CommonView } from '../common/CommonView';

import { Sections, SectionsURLs } from '../Sections';

import { LoaderSceneController } from './LoaderSceneController';
import { LoaderTransitionController } from './LoaderTransitionController';

class LoaderView extends CommonView
{
  constructor(api)
  {
    super({
      name: Sections.LOADER,
      url: SectionsURLs.LOADER,
      container: document.querySelector('.loader')
    });

    this.api = api;

    this.is_api_ready = false;

    this.current_progress = 0;
    this.target_progress = 0;

    this.performance_t = 0;

    this.scene_controller = new LoaderSceneController(this);
    this.transition_controller = new LoaderTransitionController();
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();

    this.progress_bar = document.querySelector('.loader__progress-bar-fill');

    this.set_progress(0);
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.scene_controller.before_enter();
    this.transition_controller.before_enter();
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();

    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    super.on_exit();

    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();

    this.__update_progress();

    if (this.is_api_ready)
    {
      this.set_progress(1);
      this.api.start_main_app();
    }
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.__update_progress();
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);

    this.__update_progress();
  }

  on_assets_ready()
  {
    this.scene_controller.on_assets_ready();

    if (process.env.NODE_ENV === 'development')
    {
      this.api.start_main_app();
    }
  }

  set_progress(progress)
  {
    // this.target_progress = this.__round(progress / 3, 1);
    this.target_progress = this.__round(progress, 2);
  }

  __update_progress()
  {
    const next_progress = this.__round(this.scene_controller.loading_progress, 2);
    this.target_progress = next_progress < this.target_progress ? this.target_progress : next_progress;

    this.current_progress += (this.target_progress - this.current_progress) * 0.05;
    this.current_progress = OMath.clamp(this.current_progress, 0, 1);

    this.progress_bar.style.transform = `translate3d(${this.current_progress * 100}%,0,0)`;
  }

  __set_api_ready(is_api_ready)
  {
    this.is_api_ready = is_api_ready;
  }

  __round(value, precision)
  {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}

export { LoaderView };
