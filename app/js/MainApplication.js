import { BaseApplication } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';

import DatGui from './components/DatGui';
import SceneController from './components/SceneController';
import HomeView from './views/HomeView';

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

    DatGui.init();
  }

  on_enter()
  {
    this.config = ResourceContainer.get_resource('config');

    this.sections = Sections;

    this.home_view = new HomeView();
    this.home_view.start();

    this.scene_controller.start();

    DatGui.start();

    const next_view = ViewManager.get_view_by_url(window.location.pathname) || this.home_view.name;
    this.go_to(next_view);
  }

  go_to(section)
  {
    ViewManager.go_to_view(section);
  }

  update()
  {
    this.scene_controller.update();
  }

  on_post_start()
  {
  }
}
