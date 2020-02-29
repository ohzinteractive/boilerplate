import CameraViewState from '../states/CameraViewState'
import Input from 'js/core/Input';
import Configuration from 'js/singletons/Configuration';
import CameraMovementMode from '../movement_mode/CameraMovementMode'
import RotateAndZoomAroundPoint from '../movement_mode/RotateAndZoomAroundPoint'
import CameraManager from 'js/core/CameraManager'
import Debug from 'js/core/Debug'
import Screen from 'js/core/Screen';


export default class CameraPanAndZoom extends CameraViewState
{

  constructor(oobb, up_direction){
    super();
    this.up_direction = new THREE.Vector3().copy(up_direction || new THREE.Vector3(0,1,0));

    this.oobb = oobb;
    this.pan_speed = new THREE.Vector2();
    this.out_of_bounds_force = new THREE.Vector3();

    this.zoom_speed = 0;
    this.zoom_t = 0;

    this.tilt_degrees = 70;
    this.tilt_speed = 0;

    this.vector_down_axis = new THREE.Vector3(0,-1,0);
    this.vector_back_axis = new THREE.Vector3(0,0,-1);
    this.vector_left_axis = new THREE.Vector3(-1,0,0);

    if(up_direction)
    {
      this.vector_down_axis.multiplyScalar(-1);
      this.vector_back_axis.copy(new THREE.Vector3(0,1,0).cross(up_direction));
      this.vector_left_axis.copy(up_direction.clone().cross(this.vector_back_axis).multiplyScalar(-1));
    }

    this.tmp_dir = new THREE.Vector3();
    this.tmp_ray = new THREE.Ray();

    this.tmp_forward = new THREE.Vector3();
    this.tmp_intersection = new THREE.Vector3();
    this.tmp_mouse_dir = new THREE.Vector2();

    this.reference_zoom = 0;
    this.touch_triggered = false;

    this.unproject_vec = new THREE.Vector3();

    this.raycaster = new THREE.Plane(new THREE.Vector3(0,1,0), 5);
    this.ray = new THREE.Ray();

    

    this.tmp_zoom_point = new THREE.Vector3();
    this.tmp_zoom_start_point = new THREE.Vector3();
    this.tmp_zoom_start_value = 1;
    this.tmp_zoom_lerp = 0;
    this.tmp_view_point = new THREE.Vector4();

    this.tmp_upper_bound = 0;
    this.tmp_lower_bound = 0;
    this.tmp_zoom_center = 0;

    this.starting_orientation = 0;
    this.starting_rotation = 0;



    this.starting_tilt = 0;
  }

  
  on_enter (camera_controller) {
    

    this.starting_orientation = camera_controller.current_orientation_deg;
    this.starting_tilt = camera_controller.current_tilt_deg;

    this.accumulated_tilt = 0;
    this.accumulated_orientation = 0;

    camera_controller.rotation_damping = 0.000001;
    camera_controller.rotation_response_time = 30;
    camera_controller.zoom_speed_damping = 0.1;
  }

  on_exit(camera_controller)
  {
    camera_controller.translation_speed = 40;

  }


  plane_intersection(camera_controller)
  {

    this.raycaster.set(this.vector_down_axis , camera_controller.reference_position.y);
    this.unproject_vec.x = Input.normalized_mouse_pos.x;
    this.unproject_vec.y = Input.normalized_mouse_pos.y;
    this.unproject_vec.z = 0.5;
    this.unproject_vec.unproject(CameraManager.main_camera);
    this.unproject_vec.sub(camera_controller.camera.position);

    this.unproject_vec.normalize();
    this.ray.origin.copy(camera_controller.camera.position);
    this.ray.direction.copy(this.unproject_vec);
    let asd = new THREE.Vector3();
    this.ray.intersectPlane(this.raycaster, asd);

    return asd;
  }

  get_pan_scale(camera_controller)
  {
    let pos = camera_controller.reference_position.clone();
    this.tmp_view_point.set(pos.x, pos.y, pos.z, 1).applyMatrix4(camera_controller.camera.matrixWorldInverse);
    this.tmp_view_point.y+= 1;
    this.tmp_view_point.applyMatrix4(camera_controller.camera.projectionMatrix);
    this.tmp_view_point.y/= this.tmp_view_point.w;
    pos.project(camera_controller.camera);
    pos.y = (pos.y * 0.5 + 0.5) * Screen.height;

    this.tmp_view_point.y = (this.tmp_view_point.y * 0.5 + 0.5) * Screen.height;
    return Math.max((this.tmp_view_point.y - pos.y)/(window.devicePixelRatio), 0.00000001);
  }


  update (camera_controller) {
    

  	this.tmp_forward.copy(this.vector_back_axis).applyQuaternion(camera_controller.camera.quaternion);


    this.tmp_dir.copy(this.vector_back_axis).applyQuaternion(camera_controller.camera.quaternion);



    let out_of_bounds_force = this.oobb.closest_point_on_bounds(camera_controller.reference_position).multiplyScalar(-Configuration.out_of_bounds_force);
    this.out_of_bounds_force.add(out_of_bounds_force);

		let right = this.tmp_dir.copy(this.vector_left_axis).applyQuaternion(camera_controller.camera.quaternion);
		this.tmp_forward.y = 0;
		right.y = 0;
		this.tmp_forward.normalize();
		right.normalize();

    let pan_scale = this.get_pan_scale(camera_controller);


    this.tmp_mouse_dir.copy(Input.mouse_dir);
    // this.tmp_mouse_dir.x *=  Screen.height / Screen.width;
    this.tmp_mouse_dir.multiplyScalar((1/pan_scale) * Configuration.navigation_speed);

  	if(Input.left_mouse_button_down)
  	{
  		this.pan_speed.add(this.tmp_mouse_dir);
  	}

		this.pan_speed.multiplyScalar(Configuration.navigation_speed_damping);
		this.tmp_forward.multiplyScalar(this.pan_speed.y);
    

		right.multiplyScalar(this.pan_speed.x);

    //####### SET ZOOM ########
    camera_controller.translation_speed = 60;

    if(Input.zoom_started && !this.touch_triggered)
    {
      this.tmp_zoom_point = this.plane_intersection(camera_controller);
      this.tmp_zoom_start_point.copy(camera_controller.reference_position);
      this.tmp_zoom_start_value = camera_controller.reference_zoom;
      this.reference_zoom = camera_controller.reference_zoom;

      this.touch_triggered = true;
    }
    if(!Input.zoom_started && this.touch_triggered)
    {
      this.touch_triggered = false;
    }

    if(this.touch_triggered)
    {
      let pos_lerp = THREE.Math.clamp((Input.touch_zoom-1) * Configuration.touch_zoom_speed, -1, 1);
      camera_controller.reference_position.lerpVectors(this.tmp_zoom_start_point, this.tmp_zoom_point, 
          pos_lerp);

      camera_controller.reference_zoom = this.get_zoom_lerp(camera_controller.max_zoom,
                                                            camera_controller.min_zoom,
                                                            this.tmp_zoom_start_value, 
                                                            pos_lerp);



      
      
    }
    else
    {
      this.zoom_speed += Input.wheel_delta * (camera_controller.max_zoom - camera_controller.min_zoom);
      this.zoom_speed *= Configuration.mouse_zoom_speed;
      // camera_controller.translation_speed = 60;

      camera_controller.zoom_speed_damping = 0.1;
      camera_controller.zoom_speed = 30;
      camera_controller.reference_zoom -= this.zoom_speed;


    }
    
    
    //#########################
    //#########################
    this.apply_rotation(camera_controller, Input.multi_touch_dir);
    if(Input.middle_mouse_button_down)
    {
      this.apply_rotation(camera_controller, Input.mouse_dir);
    }   

    if(!this.touch_triggered)
    camera_controller.reference_position.add(this.tmp_forward.add(
                                             right.add(
                                             this.out_of_bounds_force)).multiplyScalar(0.05));
    

    this.out_of_bounds_force.multiplyScalar(Configuration.navigation_speed_damping);

    

  }

  apply_rotation(camera_controller, input_dir)
  {
    let x_rotation = -input_dir.x*Configuration.three_finger_rotation_speed;
    let y_rotation =  input_dir.y*Configuration.three_finger_rotation_speed * Screen.get_aspect_ratio();

    if(Math.abs(this.accumulated_orientation + x_rotation) < Configuration.three_finger_allowed_x_rotation_offset)
      this.accumulated_orientation += x_rotation;
    else
      x_rotation *= 0;

    if(Math.abs(this.accumulated_tilt + y_rotation) < Configuration.three_finger_allowed_y_rotation_offset)
      this.accumulated_tilt += y_rotation;
    else
      y_rotation *= 0;

    camera_controller.set_rotation_delta( x_rotation, y_rotation);
  }

  get_zoom_lerp(from, to, initial_value, pos_lerp)
  {
    pos_lerp = pos_lerp*0.5+0.5;
    this.tmp_zoom_center = this.linear_map(initial_value, from, to, 0, 1);

    this.tmp_upper_bound = THREE.Math.lerp(this.tmp_zoom_center, 1, THREE.Math.clamp((pos_lerp-0.5)/0.5,0,1));
    this.tmp_lower_bound = THREE.Math.lerp(0, this.tmp_zoom_center, THREE.Math.clamp((pos_lerp)/0.5,0,1));


    return this.linear_map(this.tmp_upper_bound+this.tmp_lower_bound-this.tmp_zoom_center, 0, 1, from, to);
  }

  on_config_changed(map)
  {
    
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