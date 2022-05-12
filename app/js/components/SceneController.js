import { OScreen, PerspectiveCamera } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
import { Graphics } from 'ohzi-core';

import { Color } from 'three';

import CameraController from '../camera_controller/CameraController';

import HomeScene from '../scenes/HomeScene';
import TestGeneralScene from '../scenes/TestGeneralScene';

class SceneController
{
  init()
  {
    this.camera_controller = new CameraController();
  }

  start()
  {
    this.__init_camera();
    this.__init_camera_controller();

    this.home_scene = new HomeScene();

    this.test_general_scene = new TestGeneralScene();

    this.scenes = [
      this.home_scene,
      this.test_general_scene
    ];

    Graphics.update();
  }

  get_by_name(name)
  {
    for (let i = 0; i < this.scenes.length; i++)
    {
      const scene = this.scenes[i];
      if (scene.name === name)
      {
        return scene;
      }
    }

    console.error('[SceneController.get_by_name] no scene found for:', name);
    return undefined;
  }

  update()
  {
    this.camera_controller.update();

    // SceneManager.current.traverse(child =>
    // {
    //   if (child.update)
    //   {
    //     child.update();
    //   }
    //   if (child.material && child.material.update)
    //   {
    //     child.material.update();
    //   }
    // });
  }

  __init_camera()
  {
    const camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 200);
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

export default new SceneController();
