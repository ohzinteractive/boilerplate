import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from '../Sections';

import LoaderScene from './LoaderScene';

export default class LoaderViewBase extends ApplicationView
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

    this.scene = new LoaderScene(this);
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene.start();

    this.progress_bar = document.querySelector('.loader__progress-bar-fill');

    this.set_progress(0);
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.scene.before_enter();
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();
    this.scene.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();
    this.scene.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    super.on_exit();
    this.scene.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene.update();

    this.__update_progress();

    if (this.is_api_ready)
    {
      this.api.start_main_app();
      this.set_progress(1);
    }
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.set_opacity(global_view_data.loader_opacity);

    this.__update_progress();

    this.__check_performance();
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update_exit_transition(global_view_data, transition_progress, action_sequencer);

    this.set_opacity(global_view_data.loader_opacity);

    this.__update_progress();
  }
}
