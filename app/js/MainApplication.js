import { BaseApplication } from 'ohzi-core';

import { DatGUI } from './components/DatGUI';
import { HomeView } from './views/home/HomeView';
import { TransitionView } from './views/transition/TransitionView';

import { OffscreenManager } from './OffscreenManager';
import { Input } from './components/Input';
import { KeyboardInputController } from './components/KeyboardInputController';
import { InitialView } from './views/InitialView';
import { Sections } from './views/Sections';
class MainApplication extends BaseApplication
{
  init(debug_mode)
  {
    this.input = Input;
    this.sections = Sections;
    this.debug_mode = debug_mode;

    // this.ui_collision_layer = UICollisionLayer;
    // this.ui_collision_layer.init(Input, Time);

    // this.modal_component = ModalComponent;
    // this.modal_component.init(UICollisionLayer, HTMLUtilities, Time);

    // addEventListener('contextmenu', (event) =>
    // {
    //   event.preventDefault();
    // });

    DatGUI.init(this.debug_mode);
  }

  on_enter()
  {
    this.keyboard_input_controller = new KeyboardInputController();

    // __COMPONENTS__

    // __SECTIONS__

    this.initial_view = new InitialView();
    this.home_view = new HomeView();
    this.transition_view = new TransitionView();

    // this.modal_component.start();

    this.home_view.start();
    this.transition_view.start();

    DatGUI.start();

    window.onpopstate = this.go_to_url_section.bind(this);
  }

  go_to_url_section()
  {
    const data = { pathname: window.location.pathname, search: window.location.search };

    OffscreenManager.post('go_to_url_section', data);
  }

  go_to(section, change_url = true, skip = false)
  {
    OffscreenManager.post('go_to', { section, change_url, skip });
  }

  go_to_scene(view_name)
  {
    OffscreenManager.post('go_to_scene', { view_name });
  }

  update()
  {
    this.input.update();
    // this.ui_collision_layer.update();
    // this.modal_component.update();

    OffscreenManager.post('on_input_update', { data: Input.to_json() });

    this.input.clear();
  }
}

export { MainApplication };
