import { BaseApplication, Configuration, Input, OMath, OScreen, Time } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';
import { ViewContext } from 'ohzi-core';

import { DatGUI } from './components/DatGUI';
import { SceneController } from './components/SceneController';
import { HomeView } from './views/home/HomeView';
import { TransitionView } from './views/transition/TransitionView';
import { TestView } from './views/test/TestView';

import { sRGBEncoding } from 'three';
// import { ACESFilmicToneMapping } from 'three';

import { Sections } from './views/Sections';
import { FPSCounter, PerformanceController } from 'ohzi-components';
// import { KeyboardInputController } from './components/KeyboardInputController';
class MainApplication extends BaseApplication
{
  init()
  {
    this.input = Input;
    this.scene_controller = SceneController;
    this.normal_render_mode = new NormalRender();

    this.scene_controller.init();

    Graphics.set_state(this.normal_render_mode);
    Graphics._renderer.outputEncoding = sRGBEncoding;
    Graphics._renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';

    this.fps_counter = FPSCounter;
    this.fps_counter.init(Time);

    this.performance_contoller = new PerformanceController();
    this.performance_contoller.init(OMath, Configuration, Graphics, Time, OScreen, this.fps_counter);

    // Graphics._renderer.physicallyCorrectLights = true;
    // Graphics._renderer.toneMapping = ACESFilmicToneMapping;
    // Graphics._renderer.toneMappingExposure = 0.7;

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

    // this.keyboard_input_controller = new KeyboardInputController();

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive');

    this.scene_controller.start();

    // __COMPONENTS__

    // __SECTIONS__
    this.home_view = new HomeView();
    this.transition_view = new TransitionView();
    this.test_view = new TestView();
    this.home_view.start();
    this.transition_view.start();
    this.test_view.start();

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
    if (window.debug_mode || window.skip_mode)
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
    this.scene_controller.update();

    this.fps_counter.update();
    this.performance_contoller.update();
  }
}

export { MainApplication };
