import { OScreen, PerspectiveCamera, ResourceContainer, SceneManager } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
// import { Graphics } from 'ohzi-core';

import { Color } from 'three';
import { sRGBEncoding } from 'three';
import { LinearEncoding } from 'three';
import { DataTexture } from 'three';
import { RGBFormat } from 'three';

import CameraController from '../camera_controller/CameraController';

import HomeScene from '../scenes/HomeScene';
import TestScene from '../scenes/TestScene';

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

    const black_texture = new DataTexture(new Uint8Array(3), 1, 1, RGBFormat);
    black_texture.encoding = sRGBEncoding;

    const black_texture_linear = new DataTexture(new Uint8Array(3), 1, 1, RGBFormat);
    black_texture_linear.encoding = LinearEncoding;

    ResourceContainer.set_resource('black_texture_srgb', '/black_texture.jpg', black_texture);
    ResourceContainer.set_resource('black_texture_linear', '/black_texture_linear.jpg', black_texture_linear);

    this.home_scene = new HomeScene();

    this.test_scene = new TestScene();

    this.scenes = [
      this.home_scene,
      this.test_scene
    ];

    SceneManager.current = this.home_scene;

    // Graphics.update();
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
    this.camera_controller.set_simple_mode();

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
    this.camera_controller.reference_zoom = 10;
    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(0, 0);
  }
}

export default new SceneController();
