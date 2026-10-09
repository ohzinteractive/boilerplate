import { CommonScene } from './common/CommonScene';

import { Settings } from '../Settings';
import { Sections } from '../views/Sections';

import { demo_high_objects } from '../../data/assets/demo/high/demo_high_objects';
import { demo_high_sounds } from '../../data/assets/demo/high/demo_high_sounds';
import { demo_high_textures } from '../../data/assets/demo/high/demo_high_textures';
import { demo_objects } from '../../data/assets/demo/demo_objects';
import { demo_sounds } from '../../data/assets/demo/demo_sounds';
import { demo_textures } from '../../data/assets/demo/demo_textures';

import { CameraController, CameraManager, Debug, Grid, OScreen, PerspectiveCamera } from 'ohzi-core';
import { Color } from 'three';
import { SimpleCameraState } from '../camera_controller/states/SimpleCameraState';
import { Input } from '../components/Input';

export class DemoScene extends CommonScene
{
  camera: PerspectiveCamera;
  camera_controller: CameraController;

  constructor()
  {
    super({
      name: Sections.DEMO
    });
  }

  init()
  {
    super.init();

    this.camera_controller = new CameraController(Input);

    this.init_camera();
    this.setup_camera();

    this.set_assets(demo_objects, demo_textures, demo_sounds);

    if (Settings.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  update()
  {
    super.update();

    this.camera_controller.update();
  }

  on_assets_ready()
  {
    this.set_high_assets(demo_high_objects, demo_high_textures, demo_high_sounds);

    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
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
    this.camera_controller.set_state(new SimpleCameraState(Input));

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
    this.camera_controller.reference_zoom = 10;

    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(0, 0);
  }
}
