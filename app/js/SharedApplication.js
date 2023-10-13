import { ResourceContainer, TransitionManager, ViewControllerManager } from 'ohzi-core';
import { default_state_data } from '../data/default_state_data';
import { SceneController } from './components/SceneController';
import { AsyncAbstractLoader } from './loaders/AsyncAbstractLoader';
import { InitialViewController } from './views/InitialViewController';
import { HomeViewController } from './views/home/HomeViewController';
import { TransitionViewController } from './views/transition/TransitionViewController';

// Instanciated by MainThread or Worker
class SharedApplication
{
  constructor()
  {
  }

  init()
  {
    this.scene_controller = SceneController;

    this.scene_controller.init();
  }

  on_enter()
  {
    this.scene_controller.start();

    this.initial_view_controller = new InitialViewController();

    TransitionManager.set_default_state_data(default_state_data);
    ViewControllerManager.set_view_controller(this.initial_view_controller.name);

    // __SECTIONS__

    this.transition_view_controller = new TransitionViewController(this.debug_mode);
    this.home_view_controller = new HomeViewController();

    this.transition_view_controller.start();
    this.home_view_controller.start();

    // TODO: move it to another place?
    const assets_worker = AsyncAbstractLoader.create_worker();
    ResourceContainer.set_resource('assets_worker', '/assets_worker', assets_worker);
  }

  set_transitions_velocity({ search })
  {
    this.location_search = search;

    const url_params = new URLSearchParams(this.location_search);

    const transitions_velocity = Number(url_params.get('transitions_velocity')) || 1;

    TransitionManager.set_transitions_velocity(transitions_velocity);
  }

  set_next_view_controller_name({ next_view_controller_name })
  {
    ViewControllerManager.get('transition').set_next_view_controller_name(next_view_controller_name);
  }

  go_to_view_controller({ view_controller_name, skip })
  {
    ViewControllerManager.go_to_view_controller(view_controller_name, skip);
  }

  update()
  {
    this.scene_controller.update();
  }
}

export { SharedApplication };
