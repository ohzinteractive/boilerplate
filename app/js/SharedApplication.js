import { ResourceContainer, ViewContext, ViewManager } from 'ohzi-core';
import { default_state_data } from '../data/default_state_data';
import { SceneController } from './components/SceneController';
import { AsyncAbstractLoader } from './loaders/AsyncAbstractLoader';
import { InitialViewController } from './views/InitialViewController';
import { Sections } from './views/Sections';
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

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive');

    this.initial_view = new InitialViewController();

    ViewManager.set_default_state_data(default_state_data);
    ViewManager.set_view(this.initial_view.name);

    // __SECTIONS__

    this.transition_view_controller = new TransitionViewController(this.debug_mode);
    this.home_view_controller = new HomeViewController();

    this.transition_view_controller.start();
    this.home_view_controller.start();

    // TODO: move it to another place?
    const assets_worker = AsyncAbstractLoader.create_worker();
    ResourceContainer.set_resource('assets_worker', '/assets_worker', assets_worker);
  }

  go_to_url_section(pathname, search)
  {
    this.location_search = search;

    const url_params = new URLSearchParams(this.location_search);

    const transitions_velocity = url_params.get('transitions_velocity');

    ViewManager.set_transitions_velocity(transitions_velocity);

    const next_view = ViewManager.get_by_url(pathname) || this.home_view;

    this.transition_view_controller.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  go_to(section, change_url = true, skip = false)
  {
    if (this.debug_mode)
    {
      skip = true;
    }

    ViewManager.go_to_view(section, change_url, skip);
  }

  go_to_scene(view_name)
  {
    const next_view = ViewManager.get(view_name);

    this.transition_view_controller.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  update()
  {
    this.scene_controller.update();
  }
}

export { SharedApplication };
