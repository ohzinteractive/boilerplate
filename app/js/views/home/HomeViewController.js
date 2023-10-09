import { Sections, SectionsURLs } from '../Sections';

import { HomeSceneController } from './HomeSceneController';
import { HomeTransitionController } from './HomeTransitionController';

import home_data from '../../../data/transitions/home.json';
import { CommonViewController } from '../common/CommonViewController';

class HomeViewController extends CommonViewController
{
  constructor()
  {
    super({
      name: Sections.HOME,
      url: SectionsURLs.HOME,
      transition_data: home_data
    });

    this.scene_controller = new HomeSceneController();
    this.transition_controller = new HomeTransitionController();
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    super.start();

    this.scene_controller.start();
    this.transition_controller.start();
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    super.before_enter();

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
    super.update();

    this.scene_controller.update();
    this.transition_controller.update();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);

    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { HomeViewController };
