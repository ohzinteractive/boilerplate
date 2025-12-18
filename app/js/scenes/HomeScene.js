
import { Sections } from '../views/Sections';

import { home_high_objects } from '../../data/assets/home/high/home_high_objects';
import { home_high_sounds } from '../../data/assets/home/high/home_high_sounds';
import { home_high_textures } from '../../data/assets/home/high/home_high_textures';
import { home_objects } from '../../data/assets/home/home_objects';
import { home_textures } from '../../data/assets/home/home_textures';

import { CameraManager, Debug, OScreen, PerspectiveCamera, ResourceContainer } from 'ohzi-core';
import { Color } from 'three';
import { CameraController } from '../camera_controller/CameraController';
import { Settings } from '../Settings';
import { CommonScene } from './common/CommonScene';

// import { AmbientLight, DirectionalLight } from 'three';
export class HomeScene extends CommonScene
{
  constructor()
  {
    super({
      name: Sections.HOME
    });
  }

  init()
  {
    super.init();

    this.camera_controller = new CameraController();

    this.init_camera();
    this.setup_camera();

    this.set_assets(home_objects, home_textures, []);

    // AudioManager.setup_sounds_names(home_high_sounds);

    if (Settings.debug_mode)
    {
      this.add(Debug.draw_axis());
      // this.add(new Grid());
    }
  }

  // add_lights()
  // {
  //   const light = new AmbientLight('#FFFFFF', 0.9);
  //   this.add(light);

  //   const directional_light = new DirectionalLight('#FFFFFF', 0.5);
  //   directional_light.position.set(0, 10, 20);
  //   this.add(directional_light);
  // }

  update()
  {
    super.update();

    this.camera_controller.update();

    // this.camera.fov = Settings.camera.fov;
  }

  on_assets_ready()
  {
    this.set_high_assets(home_high_objects, home_high_textures, home_high_sounds);

    super.on_assets_ready();

    // this.add_lights();
    const cube = ResourceContainer.get('cube').scene;

    this.add(cube);
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();

    // AudioManager.init_sounds(home_high_sounds);
  }

  init_camera()
  {
    this.camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 200);
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 10;

    this.camera.clear_color.copy(new Color('#181818'));
    this.camera.clear_alpha = 1;
  }

  setup_camera()
  {
    CameraManager.current = this.camera;

    this.camera_controller.set_camera(this.camera);
    // this.camera_controller.set_idle();
    this.camera_controller.set_simple_mode();

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
    this.camera_controller.reference_zoom = 10;

    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(0, 0);
  }
}
