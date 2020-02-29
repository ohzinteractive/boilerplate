import CameraMovementMode from './CameraMovementMode'
import Time from 'js/core/Time';

import Debug from 'js/core/Debug'


export default class RotateAndZoomAroundPoint extends CameraMovementMode
{

  constructor(){
    super();
    this.rotation_speed = new THREE.Vector2();

    this.vector_up_axis   = new THREE.Vector3(0,1,0);
    this.vector_forward_axis   = new THREE.Vector3(0,0,-1);
    this.tmp_up1 = new THREE.Vector3();
    this.tmp_up2 = new THREE.Vector3();
    this.tmp_forward = new THREE.Vector3();


    this.tmp_new_pos = new THREE.Vector3();
  }

  
  on_enter (camera_controller) {
    camera_controller.reference_rotation.copy(camera_controller.camera.quaternion);
  }


  update (camera_controller) {



    camera_controller.camera.quaternion.slerp(camera_controller.reference_rotation, 
          1.0 - Math.pow(camera_controller.rotation_damping,Time.delta_time*camera_controller.rotation_response_time));

    this.tmp_forward.copy(this.vector_forward_axis);
    let dir = this.tmp_forward.applyQuaternion(camera_controller.camera.quaternion);


    let position_error = camera_controller.reference_position.clone().sub(camera_controller.__last_reference_position);


    this.tmp_new_pos.copy(camera_controller.__last_reference_position);
    this.tmp_new_pos.add(position_error);
    position_error.add(camera_controller.__last_reference_position);
    this.tmp_new_pos.lerpVectors(camera_controller.__last_reference_position, position_error, 
          1.0 - Math.pow(camera_controller.translation_damping,Time.delta_time*camera_controller.translation_response));

    let current_zoom = camera_controller.camera.position.distanceTo(camera_controller.__last_reference_position);

    camera_controller.reference_zoom = THREE.Math.clamp(camera_controller.reference_zoom, 
                                          camera_controller.min_zoom, camera_controller.max_zoom);

    let zoom_error = camera_controller.reference_zoom - current_zoom;

    current_zoom =  THREE.Math.lerp(current_zoom, current_zoom+zoom_error, 
          1.0 - Math.pow(camera_controller.zoom_damping, Time.delta_time * camera_controller.zoom_response));                   

    if(camera_controller.camera.isOrthographicCamera)
    {
      camera_controller.camera.zoom = current_zoom*2;
    }

    camera_controller.camera.position.copy(this.tmp_new_pos).sub(dir.multiplyScalar(current_zoom));
    camera_controller.camera.up.copy(new THREE.Vector3(0,1,0).applyQuaternion(camera_controller.camera.quaternion));
    camera_controller.camera.lookAt(this.tmp_new_pos);

    camera_controller.__last_reference_position.copy(this.tmp_new_pos);

  }



  clamp(a,b,c)
  {
    return Math.max(b,Math.min(c,a));
  }
  saturate(a,b)
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