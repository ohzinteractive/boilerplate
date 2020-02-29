import CameraViewState from '../states/CameraViewState'
import Input from 'js/core/Input';
import Configuration from 'js/singletons/Configuration';
import Debug from 'js/core/Debug'
import CameraUtilities from 'js/core/utilities/CameraUtilities';

import UpdateCameraPosition from 'js/components/UpdateCameraPosition';

export default class StandardMovement extends CameraViewState
{
	constructor(camera_controller)	
	{
		super();
		this.update_camera_position = new UpdateCameraPosition(camera_controller);
		this.tmp_up_vec = new THREE.Vector3(0,1,0);

	}

	on_enter(camera_controller)
	{
		// camera_controller.translation_response = 1;
		// camera_controller.translation_damping = 0;

  //   camera_controller.zoom_speed_damping = 0.1;
	}

	on_exit(camera_controller)	{	}

	update(camera_controller)	
	{
		// console.log(camera_controller.reference_position)
		this.update_camera_position.update(camera_controller.reference_position, this.tmp_up_vec);
    camera_controller.reference_zoom -= Input.wheel_delta * (camera_controller.max_zoom - camera_controller.min_zoom)*0.05;

    if(Input.right_mouse_button_down)
    {

    	camera_controller.set_rotation_delta(Input.mouse_dir.x * -30.5, 
                                          Input.mouse_dir.y * 20.5);
    }

	}
}