import CameraViewState from '../states/CameraViewState'
import { Input } from 'ohzi-core';

export default class RotationOnly extends CameraViewState {

	constructor(oobb) {
		super();


		this.tilt_degrees = 70;
		this.tilt_speed = 0;

		this.vector_down_axis = new THREE.Vector3(0, -1, 0);
		this.vector_up_axis = new THREE.Vector3(0, 1, 0);
		this.vector_back_axis = new THREE.Vector3(0, 0, -1);
		this.vector_left_axis = new THREE.Vector3(-1, 0, 0);

		this.tmp_dir = new THREE.Vector3();
		this.tmp_ray = new THREE.Ray();

		this.tmp_intersection = new THREE.Vector3();
		this.tmp_mouse_dir = new THREE.Vector2();

		this.last_point = new THREE.Vector3();

	}


	on_enter(camera_controller) {
		this.t_damping = 0;
	}

	on_exit(camera_controller) {
	}

	update(camera_controller) {
		if (!camera_controller.input_enabled) {
			return;
		}

		if (Input.left_mouse_button_down) {

			camera_controller.set_rotation_delta(Input.mouse_dir.x * 15.5,
				Input.mouse_dir.y * -10.5);
		}
	}


	clamp(a, b, c) {
		return Math.max(b, Math.min(c, a));
	}
	step(a, b) {
		if (b > a)
			return 1;
		return 0;
	}

	linear_map(value,
		from_range_start_value,
		from_range_end_value,
		to_range_start_value,
		to_range_end_value) {
		return ((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (to_range_end_value - to_range_start_value) + to_range_start_value;
	}



}
