import { BaseApplication } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import SceneController from './components/SceneController';
import HomeView from './views/HomeView';

export default class MainApplication extends BaseApplication
{
  init(renderer)
  {
    this.renderer = renderer;
    this.scene_controller = SceneController;
    this.normal_render_mode = new NormalRender();

    this.scene_controller.init();
  }

  start()
  {
    Graphics.set_state(this.normal_render_mode);

    this.config = ResourceContainer.get_resource('config');

    this.scene_controller.start();

    this.home_view = new HomeView();
    this.home_view.start();
  }

  update()
  {
    this.scene_controller.update();
    this.home_view.update();
  }

  on_resize()
  {
  }

  on_post_start()
  {
  }
}
