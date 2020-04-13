import CameraViewState from '../states/CameraViewState'
import CameraMovementMode from '../movement_mode/CameraMovementMode'
import RotateAndZoomAroundPoint from '../movement_mode/RotateAndZoomAroundPoint'

import {Input}  from 'ohzi-core';
import {CameraUtilities} from 'ohzi-core';

export default class CameraDebugState extends CameraViewState
{

  constructor(oobb){
    super();
    this.pan_speed = new THREE.Vector2();

    this.zoom_speed = 0;
    this.zoom_t = 0;

    this.tilt_degrees = 70;
    this.tilt_speed = 0;

    this.vector_down_axis = new THREE.Vector3(0,-1,0);
    this.vector_up_axis   = new THREE.Vector3(0,1,0);
    this.vector_back_axis = new THREE.Vector3(0,0,-1);
    this.vector_left_axis = new THREE.Vector3(-1,0,0);

    this.tmp_dir = new THREE.Vector3();
    this.tmp_ray = new THREE.Ray();

    this.tmp_intersection = new THREE.Vector3();
    this.tmp_mouse_dir = new THREE.Vector2();

    this.last_point = new THREE.Vector3();

  }

  
  on_enter (camera_controller) {
    this.t_damping = 0;
  }

  on_exit(camera_controller)
  {
  }

  update (camera_controller) {
  	if(!camera_controller.input_enabled)
  	{
  		return;
  	}

    if(camera_controller.camera.isOrthographicCamera)
    {
      camera_controller.reference_zoom += Input.wheel_delta *2 ;
    }else
    {
      camera_controller.reference_zoom += Input.wheel_delta *2 ;
    }
    if(Input.left_mouse_button_down)
    {

      camera_controller.set_rotation_delta(Input.mouse_dir.x * -0.5, 
                                          Input.mouse_dir.y * 0.8);
    }


    if(Input.right_mouse_button_pressed)
    {
      this.last_point.copy(Input.NDC);
    }
    if(Input.right_mouse_button_down)
    {
      let prev_point    = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.last_point).clone();
      let current_point = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, Input.NDC).clone();
      current_point.sub(prev_point);

      camera_controller.reference_position.x -= current_point.x;
      camera_controller.reference_position.y -= current_point.y;
      camera_controller.reference_position.z -= current_point.z;
      
      this.last_point.copy(Input.NDC);
    }
  }


  clamp(a,b,c)
  {
    return Math.max(b,Math.min(c,a));
  }
  step(a,b)
  {
    if(b > a)
      return 1;
    return 0;
  }

  linear_map(value,
             from_range_start_value,
             from_range_end_value,
             to_range_start_value,
             to_range_end_value)
    {
        return ((value - from_range_start_value)/ (from_range_end_value - from_range_start_value)) * (to_range_end_value - to_range_start_value) + to_range_start_value;
    }

  

}