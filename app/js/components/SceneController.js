import { PerspectiveCamera } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
import { Grid } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';
import { Screen } from 'ohzi-core';
import { Graphics } from 'ohzi-core';

import { Color } from 'three';
// import { AmbientLight } from 'three';
// import { DirectionalLight } from 'three';
// import { SpotLight } from 'three';

import CameraController from '../camera_controller/CameraController';

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

    this.add_lights();

    // Debug.draw_sphere();
    Debug.draw_axis();
    SceneManager.current.add(new Grid());

    // Here we add all objects into the scene
    // this.alley = new Alley();
    // SceneManager.current.add(this.alley);

    // Compile shaders on the first frame
    Graphics.update();

    // After the object is rendered, we hide it
    // this.alley.hide();
  }

  add_lights()
  {
    // let light = new AmbientLight('#FFFFFF', 2);
    // SceneManager.current.add(light);

    // let directional_light = new DirectionalLight('#FFFFFF', 1);
    // directional_light.position.set(0, 10, 20);
    // SceneManager.current.add(directional_light);

    // let spot_light = new SpotLight('#FFFFFF', 0.3);
    // spot_light.position.set(-10, 10, 20);
    // SceneManager.current.add(spot_light);

    // let spot_light_2 = new SpotLight('#FFFFFF', 0.3);
    // spot_light_2.position.set(10, 10, 20);
    // SceneManager.current.add(spot_light_2);
  }

  update()
  {
    this.camera_controller.update();
    // this.alley.update();
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

export default new SceneController();
