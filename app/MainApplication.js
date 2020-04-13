import { BaseApplication } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
import { PerspectiveCamera } from 'ohzi-core';
import { Screen } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';

import CameraController from '/js/components/CameraController/CameraController';

export default class MainApplication extends BaseApplication {
	constructor(renderer) {
		super();
		this.renderer = renderer;

		this.camera_controller = new CameraController();
		this.normal_render_mode = new NormalRender();

	}

	start() {
		Graphics.set_state(this.normal_render_mode);

		this.__init_camera();
		this.__init_camera_controller();
		this.on_resize(); // force resize update before the first frame

		this.config = ResourceContainer.get_resource("config");

	}

	update() {
	}

	on_resize() {
		Graphics.on_resize();
	}

	__init_camera() {
		let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 200);
		camera.updateProjectionMatrix();
		camera.position.z = 10;

		camera.clear_color.copy(new THREE.Color("#000000"));
		camera.clear_alpha = 1;
		CameraManager.current = camera;
	}

	__init_camera_controller() {
		this.camera_controller.set_camera(CameraManager.current);
		this.camera_controller.set_idle();
		this.camera_controller.min_zoom = 0.001;
		this.camera_controller.max_zoom = 0.002;
		this.camera_controller.reference_zoom = 0.0015;
		this.camera_controller.reference_position.set(0, 0, 0);
	}

}
