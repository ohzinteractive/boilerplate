import { ApplicationView, ViewManager } from 'ohzi-core';
import { Sections, SectionsURLs } from '../Sections';

import TransitionSceneController from './TransitionSceneController';
import TransitionTransitionController from './TransitionTransitionController';

export default class TransitionView extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.TRANSITION,
      url: SectionsURLs.TRANSITION,
      container: document.querySelector('.transition')
    });

    this.scene_controller = new TransitionSceneController();
    this.transition_controller = new TransitionTransitionController();

    this.next_view_name = '';
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();
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
    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();

    this.__check_section_ready();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }

  set_next_view(view)
  {
    this.scene_controller.set_next_scene(view.scene_controller.scene);
    this.next_view_name = view.name;
  }

  __check_section_ready()
  {
    if (this.scene_controller.is_ready_to_exit())
    {
      let skip = false;

      if (window.debug_mode || window.skip_mode)
      {
        skip = true;
      }

      ViewManager.go_to_view(this.next_view_name, true, skip);
    }
  }
}
