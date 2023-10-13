import { ResourceContainer, TransitionManager, ViewContext, ViewControllerManager } from 'ohzi-core';
import { default_state_data } from '../data/default_state_data';
import { SceneController } from './components/SceneController';
import { AsyncAbstractLoader } from './loaders/AsyncAbstractLoader';
import { InitialViewController } from './views/InitialViewController';
import { HomeViewController } from './views/home/HomeViewController';
import { TransitionViewController } from './views/transition/TransitionViewController';

// Instanciated by MainThread or Worker
class SharedApplication
{
  constructor(app)
  {
    this.app = app;
  }

  init()
  {
    this.scene_controller = SceneController;

    this.scene_controller.init();
  }

  on_enter()
  {
    this.scene_controller.start();

    ViewContext.set_app(this);

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

  set_transitions_velocity(search)
  {
    this.location_search = search;

    const url_params = new URLSearchParams(this.location_search);

    const transitions_velocity = Number(url_params.get('transitions_velocity')) || 1;

    TransitionManager.set_transitions_velocity(transitions_velocity);
  }

  update()
  {
    this.scene_controller.update();
  }
}

export { SharedApplication };
