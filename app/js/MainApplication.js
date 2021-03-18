import { BaseApplication } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
import { PerspectiveCamera } from 'ohzi-core';
import { Screen } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { Grid } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';

import { Color } from 'three';
import CameraController from './camera_controller/CameraController';
import HomeView from './views/HomeView';

export default class MainApplication extends BaseApplication
{
  init(renderer)
  {
    this.renderer = renderer;

    this.camera_controller = new CameraController();
    this.normal_render_mode = new NormalRender();
  }

  start()
  {
    Graphics.set_state(this.normal_render_mode);

    this.__init_camera();
    this.__init_camera_controller();

    this.config = ResourceContainer.get_resource('config');

    Debug.draw_axis();
    SceneManager.current.add(new Grid());

    this.home_view = new HomeView();
    this.home_view.start();
  }

  update()
  {
    this.camera_controller.update();
    this.home_view.update();
  }

  on_resize()
  {
  }

  post_start()
  {
  }

  __init_camera()
  {
    let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 200);
    camera.updateProjectionMatrix();
    camera.position.z = 10;

    camera.clear_color.copy(new Color('#181818'));
    camera.clear_alpha = 1;
    CameraManager.current = camera;
  }

  __init_camera_controller()
  {
    this.camera_controller.set_camera(CameraManager.current);
    // this.camera_controller.set_idle();
    this.camera_controller.set_standard_mode();

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
    this.camera_controller.reference_zoom = 30;
    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(45, 0);
  }
}
