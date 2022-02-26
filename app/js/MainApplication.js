import { BaseApplication } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';
import { ViewContext } from 'ohzi-core';

import DatGUI from './components/DatGUI';
import SceneController from './components/SceneController';
import HomeView from './views/home/HomeView';

import { sRGBEncoding } from 'three';

import { Sections } from './views/Sections';

export default class MainApplication extends BaseApplication
{
  init()
  {
    this.scene_controller = SceneController;
    this.normal_render_mode = new NormalRender();

    this.scene_controller.init();

    Graphics.set_state(this.normal_render_mode);
    Graphics._renderer.outputEncoding = sRGBEncoding;
    Graphics._renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';

    DatGUI.init();
  }

  on_enter()
  {
    this.config = ResourceContainer.get_resource('config');

    this.sections = Sections;

    ViewContext.set_app(this);

    // __SECTIONS__
    this.home_view = new HomeView();
    this.home_view.start();

    // __COMPONENTS__

    this.scene_controller.start();

    DatGUI.start();

    window.onpopstate = this.go_to_url_section.bind(this, true);

    this.go_to_url_section(false);
  }

  go_to_url_section(skip)
  {
    const next_view = ViewManager.get_by_url(window.location.pathname) || this.home_view;
    this.go_to(next_view.name);
  }

  go_to(section, skip = false)
  {
    ViewManager.go_to_view(section, true, skip);
  }

  update()
  {
    this.scene_controller.update();
  }
}
