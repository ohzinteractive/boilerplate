import BaseApplication from 'js/core/BaseApplication';
import CameraManager from 'js/core/CameraManager';
import SceneManager from 'js/core/SceneManager';
import Screen from 'js/core/Screen';
import CameraController from 'js/components/CameraController/CameraController';
import PerspectiveCamera from 'js/core/PerspectiveCamera';
import OrthographicCamera from 'js/core/OrthographicCamera';

import NormalRender from 'js/core/render_mode/NormalRender';
import Graphics from 'js/core/Graphics';

import CameraViewCube from 'js/components/camera_view_cube/CameraViewCube';

import HTMLManager from './js/html_components/common/HTMLManager';

export default class OHZIExampleApplication extends BaseApplication
{
  constructor(renderer)
  {
    super();
    this.renderer = renderer;

    this.camera_controller = new CameraController();
    this.normal_render_mode = new NormalRender();

    Graphics.set_state(this.normal_render_mode);

    this.view_cube_layer = undefined;
  }

  start()
  {
    this.__init_camera();
    this.__init_camera_controller();
    // this.__init_viewcube()
    // Debug.draw_axis();

    // this.reference_position = new THREE.Vector3();

    this.on_resize();
  }

  resources_fully_loaded() {

  }

  update()
  {
    this.camera_controller.update();
    // this.camera_view_cube.update();
  }

  on_resize() {
    Graphics.on_resize();
    HTMLManager.on_resize();
    this.home_background.style.height = `${this.home.clientHeight}px`;
  }

  __init_camera()
  {
    let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 200);
    // let camera = new OrthographicCamera( Screen.width / - 2, Screen.width / 2, Screen.height / 2, Screen.height / - 2, 0.1, 200 );
    // camera.zoom = 40;
    camera.updateProjectionMatrix();
    camera.position.z = 10;

    camera.clear_color.copy(new THREE.Color("#000000"));
    camera.clear_alpha = 0;
    CameraManager.current = camera;
  }

  __init_camera_controller()
  {
    this.camera_controller.set_camera(CameraManager.current);
    // this.camera_controller.set_debug_mode();
    this.camera_controller.set_idle();
    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 200;
    this.camera_controller.reference_zoom = 1;
    // this.camera_controller.set_tilt(90);
    this.camera_controller.set_tilt(90 - 66 );
    this.camera_controller.reference_position.set(0,-0.0745,0);
  }

  __init_viewcube()
  {
    this.view_cube_layer = {
    	camera: new OrthographicCamera(-1.1, 1.1, 1.1, -1.1, 0.1, 200),
    	scene: new THREE.Scene(),
    	viewport: new THREE.Vector4(Screen.width-256, Screen.height-256, 256, 256)
    }

    this.layered_render = new LayeredRender([this.view_cube_layer])
    Graphics.set_state(this.layered_render);


		let bounding_box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(1,10,5));

    this.camera_view_cube = new CameraViewCube( this.camera_controller,
    																						0,
  																							this.view_cube_layer.viewport,
  																							this.view_cube_layer.camera,
  																							bounding_box);
    this.camera_view_cube.scale.set(0.5, 0.5, 0.5)
    this.view_cube_layer.scene.add(this.camera_view_cube);
  }
}
