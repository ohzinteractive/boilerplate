import { BaseApplication, ViewManager } from 'ohzi-core';

import { DatGUI } from './components/DatGUI';
import { HomeView } from './views/home/HomeView';
import { TransitionView } from './views/transition/TransitionView';

import { OffscreenManager } from './OffscreenManager';
import { KeyboardInputController } from './components/KeyboardInputController';
import { MainInput } from './components/MainInput';
import { MainThreadMainAppStrategy } from './mainapp_strategies/MainThreadMainAppStrategy';
import { OffScreenMainAppStrategy } from './mainapp_strategies/OffScreenMainAppStrategy';
import { InitialView } from './views/InitialView';
import { Sections } from './views/Sections';
class MainApplication extends BaseApplication
{
  init(debug_mode, use_offscreen_canvas)
  {
    this.strategies = {
      main_thread: new MainThreadMainAppStrategy(this),
      offscreen: new OffScreenMainAppStrategy(this)
    };

    this.current_strategy = use_offscreen_canvas ? this.strategies.offscreen : this.strategies.main_thread;

    this.current_strategy.init();

    this.main_input = MainInput;
    this.sections = Sections;
    this.debug_mode = debug_mode;

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive');
    this.view_manager.set_offscreen_manager(OffscreenManager);

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
    this.current_strategy.on_enter();

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

    this.go_to_url_section();
  }

  go_to_url_section()
  {
    const next_view = ViewManager.get_by_url(window.location.pathname) || this.home_view;

    this.go_to_scene(next_view.name);
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
    ViewManager.go_to_scene(view_name, false, false);
  }

  update()
  {
    this.main_input.update();
    // this.ui_collision_layer.update();
    // this.modal_component.update();

    this.current_strategy.update();
  }

  on_frame_end()
  {
    this.main_input.clear();
  }
}

export { MainApplication };
