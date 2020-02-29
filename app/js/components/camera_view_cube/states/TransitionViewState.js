import ViewBaseState from './ViewBaseState';
import IdleViewState from './IdleViewState';
import Time from 'js/core/Time';
import EasingFunctions from 'js/core/utilities/EasingFunctions';

export default class TransitionViewState extends ViewBaseState
{
	constructor(target_tilt, target_orientation)
	{
		super();
		this.t = 0;

		this.target_tilt = target_tilt;
		this.target_orientation = target_orientation;

		this.start_tilt = 0;
		this.start_orientation = 0;

		this.start_position = new THREE.Vector3();
		this.end_position = new THREE.Vector3();
	}

	on_enter(camera_view_cube)
	{
		this.start_tilt = camera_view_cube.camera_controller.current_tilt;
		this.start_orientation = camera_view_cube.camera_controller.current_orientation;
		
		this.start_position.copy(camera_view_cube.camera_controller.reference_position);
		camera_view_cube.bounding_box.getCenter(this.end_position);

		let zoom = camera_view_cube.camera_controller.get_zoom_to_focus_camera_on_bounding_box(camera_view_cube.bounding_box, this.target_tilt, this.target_orientation);
		camera_view_cube.camera_controller.reference_zoom = zoom;

		camera_view_cube.camera_controller.input_enabled = false;
	}

	on_exit(camera_view_cube)
	{
		camera_view_cube.camera_controller.input_enabled = true;
	}

	update(camera_view_cube)
	{
		this.t += Time.delta_time * 2;
		this.set_camera_params(camera_view_cube.camera_controller, EasingFunctions.ease_out_cubic(this.t));
		if(this.t >= 1)
		{
			this.set_camera_params(camera_view_cube.camera_controller, 1);
			camera_view_cube.set_state(new IdleViewState())
		}
	}

	set_camera_params(camera_controller, t)
	{
		camera_controller.lerp_rotation(this.start_tilt, this.target_tilt, this.start_orientation, this.target_orientation, t);
		camera_controller.reference_position.lerpVectors(this.start_position, this.end_position, t);
	}


}
