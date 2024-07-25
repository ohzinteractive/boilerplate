import { BaseApplication } from 'ohzi-core';
// import { HTMLUtilities, Time } from 'ohzi-core';
import { Graphics, NormalRender, ResourceContainer, ViewContext, ViewManager } from 'ohzi-core';

import { DatGUI } from './components/DatGUI';
import { HomeView } from './views/home/HomeView';
import { TransitionView } from './views/transition/TransitionView';

// import { ACESFilmicToneMapping } from 'three';

import { Sections } from './views/Sections';
// import { ModalComponent } from './view_components/modal/ModalComponent';
// import { UICollisionLayer } from 'ohzi-components';
import { Input } from './components/Input';
import { KeyboardInputController } from './components/KeyboardInputController';
import { Settings } from './Settings';
// import { KeyboardInputController } from './components/KeyboardInputController';
class MainApplication extends BaseApplication
{
  init()
  {
    this.input = Input;
    this.normal_render_mode = new NormalRender();

    Graphics.set_state(this.normal_render_mode);
    // Graphics._renderer.outputColorSpace = LinearSRGBColorSpace;
    Graphics._renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';

    // Graphics._renderer.physicallyCorrectLights = true;
    // Graphics._renderer.toneMapping = ACESFilmicToneMapping;
    // Graphics._renderer.toneMappingExposure = 0.7;

    // this.ui_collision_layer = UICollisionLayer;
    // this.ui_collision_layer.init(Input, Time);

    // this.modal_component = ModalComponent;
    // this.modal_component.init(UICollisionLayer, HTMLUtilities, Time);

    // addEventListener('contextmenu', (event) =>
    // {
    //   event.preventDefault();
    // });

    DatGUI.init();
  }

  on_enter()
  {
    this.config = ResourceContainer.get_resource('config');

    this.sections = Sections;

    ViewContext.set_app(this);

    this.keyboard_input_controller = new KeyboardInputController();

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive');

    // __COMPONENTS__

    // __SECTIONS__

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

    this.transition_view.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  go_to(section, change_url = true, skip = false)
  {
    if (Settings.debug_mode)
    {
      skip = true;
    }

    ViewManager.go_to_view(section, change_url, skip);
  }

  go_to_scene(view_name)
  {
    const next_view = ViewManager.get(view_name);

    this.transition_view.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  update()
  {
    // this.ui_collision_layer.update();
    // this.modal_component.update();
  }
}

export { MainApplication };
