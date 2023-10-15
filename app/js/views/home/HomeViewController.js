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

  get scene()
  {
    return this.scene_controller.scene;
  }

  start()
  {
    super.start();

    this.scene_controller.start();
    this.transition_controller.start();
  }

  show()
  {
    super.show();

    this.scene_controller.show();
    this.transition_controller.show();
  }

  before_enter()
  {
    super.before_enter();

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
    super.update();

    this.scene_controller.update();
    this.transition_controller.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);

    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { HomeViewController };
