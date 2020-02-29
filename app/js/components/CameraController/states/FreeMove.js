import CameraViewState from '../states/CameraViewState';
import CameraUtilities from 'js/core/utilities/CameraUtilities';
import Input from 'js/core/Input';
import Configuration from 'js/singletons/Configuration';
import Time from 'js/core/Time';

export default class FreeMove extends CameraViewState
{
	constructor(bounds)	
	{
		super();
		this.camera_z_axis = new THREE.Vector3();
		this.camera_x_axis = new THREE.Vector3();
		this.camera_y_axis = new THREE.Vector3();
		this.tmp_mouse_dir = new THREE.Vector2();
		this.bounds = bounds;
		this.out_of_bounds_force = 0;

		this.tmp_clamped_point = new THREE.Vector3();
		this.tmp_force = 0;

		this.pan_speed_scaling = 1;
	}

	on_enter(camera_controller)	{
		
	}

	on_exit(camera_controller)	{

	}

	update(camera_controller)
	{
		this.camera_y_axis.set(0,1,0);
		this.camera_x_axis.copy(CameraUtilities.get_camera_right_dir(camera_controller.camera));
		
		this.tmp_force += this.bounds.distanceToPoint(camera_controller.reference_position);

		this.pan_speed_scaling = THREE.Math.lerp(10,70, 
                          THREE.Math.clamp(camera_controller.reference_zoom-50, 0, 500)/500);

		this.tmp_mouse_dir.copy(Input.mouse_dir).multiplyScalar(Input.mouse_speed*this.pan_speed_scaling);

		this.camera_y_axis.multiplyScalar(this.tmp_mouse_dir.y);
		this.camera_x_axis.multiplyScalar(-this.tmp_mouse_dir.x);


		this.bounds.clampPoint(camera_controller.reference_position, this.tmp_clamped_point);

		this.tmp_clamped_point.sub(camera_controller.reference_position).normalize();
		this.tmp_clamped_point.multiplyScalar(this.tmp_force);

		this.set_forward_vector(camera_controller);
		this.camera_y_axis.add(this.camera_x_axis)
						  .add(this.tmp_clamped_point)
						  .add(this.camera_z_axis)
						  .multiplyScalar(Time.delta_time*7);
		// this.camera_z_axis.multiplyScalar(Input.wheel_delta * Configuration.zoom_speed);
		camera_controller.reference_position.add(this.camera_y_axis);
		this.tmp_force *= 0.8;

    camera_controller.set_rotation_delta(Input.finger_rotation * -2.5 * Time.delta_time, 0);

	}

	set_forward_vector(camera_controller)
	{
		this.camera_z_axis.copy(CameraUtilities.get_camera_forward_dir(camera_controller.camera));
		this.camera_z_axis.y = 0;
		this.camera_z_axis.normalize();
		this.camera_z_axis.multiplyScalar(-Input.wheel_delta * Configuration.zoom_speed * 5);
	}


}
