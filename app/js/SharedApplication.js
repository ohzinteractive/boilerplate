import { ResourceContainer, TransitionManager, VCManager } from 'ohzi-core';
import { default_state_data } from '../data/default_state_data';
import { AsyncAbstractLoader } from './loaders/AsyncAbstractLoader';
import { InitialViewController } from './views/InitialViewController';
import { HomeViewController } from './views/home/HomeViewController';
import { TransitionViewController } from './views/transition/TransitionViewController';

// Instanciated by MainThread or Worker
// Runs at the same thread of the RenderLoop
class SharedApplication
{
  constructor()
  {
  }

  init()
  {

  }

  on_enter()
  {
    this.initial_view_controller = new InitialViewController();

    TransitionManager.set_default_state_data(default_state_data);
    VCManager.set_view_controller(this.initial_view_controller.name);

    // __COMPONENT_CONTROLLERS__

    // __SECTION_CONTROLLERS__
    this.transition_view_controller = new TransitionViewController();
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

  set_next_view_controller_name(next_view_controller_name)
  {
    VCManager.get('transition').set_next_view_controller_name(next_view_controller_name);
  }

  go_to_view_controller(view_controller_name, skip)
  {
    VCManager.go_to_view_controller(view_controller_name, skip);
  }

  update()
  {
  }
}

export { SharedApplication };
