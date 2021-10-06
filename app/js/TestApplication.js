import { BaseApplication } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { PerspectiveCamera } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';

import { sRGBEncoding } from 'three';
import { Vector3 } from 'three';
import { Color } from 'three';

import { CameraManager } from 'ohzi-core';
import { Grid } from 'ohzi-core';
import { Time } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';
import CameraController from './camera_controller/CameraController';
import CameraSimpleState from './camera_controller/states/CameraSimpleState';
import { ViewManager } from 'ohzi-core';
import TestingView from './views/TestingView';
import DatGui from './components/DatGui';

export default class TestApplication extends BaseApplication
{
  init()
  {
    Graphics.set_state(new NormalRender());
    // Graphics._renderer.outputEncoding = sRGBEncoding;
    this.camera_controller = new CameraController();

    document.addEventListener('contextmenu', (event) =>
    {
      event.preventDefault();
    }, false);
    document.addEventListener('gesturestart', function(e)
    {
      e.preventDefault();
    });
    document.addEventListener('gestureend', function(e)
    {
      e.preventDefault();
    });
    DatGui.init(this);
  }

  on_enter()
  {
    this.__init_camera();
    this.__init_camera_controller();

    Debug.draw_axis();
    SceneManager.current.add(new Grid());

    let testing_view = new TestingView();
    testing_view.start();
    ViewManager.go_to_view(testing_view.name, false);
  }

  update()
  {
    this.camera_controller.update();
  }

  __init_camera()
  {
    let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 100);
    camera.updateProjectionMatrix();
    camera.position.z = 10;

    camera.clear_color.copy(new Color('#1A1A1A'));
    camera.clear_alpha = 1;
    CameraManager.current = camera;
  }

  __init_camera_controller()
  {
    this.camera_controller.set_camera(CameraManager.current);
    this.camera_controller.set_state(new CameraSimpleState());

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 50;
    this.camera_controller.reference_zoom = 2;
    this.camera_controller.set_rotation(10, 290);
    this.camera_controller.reference_position.set(0, 0.5, 0);
  }
}
