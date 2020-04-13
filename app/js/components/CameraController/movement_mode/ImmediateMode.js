
import CameraMovementMode from './CameraMovementMode'


export default class ImmediateMode extends CameraMovementMode {

  constructor() {
    super();
    this.rotation_speed = new THREE.Vector2();

    this.vector_up_axis = new THREE.Vector3(0, 1, 0);
    this.vector_forward_axis = new THREE.Vector3(0, 0, -1);
    this.tmp_up1 = new THREE.Vector3();
    this.tmp_up2 = new THREE.Vector3();
    this.tmp_forward = new THREE.Vector3();


    this.tmp_new_pos = new THREE.Vector3();

    this.tmp_quat = new THREE.Quaternion();
    this.tmp_camera_target_pos = new THREE.Vector3();
  }


  on_enter(camera_controller) {
    camera_controller.reference_rotation.copy(camera_controller.camera.quaternion);
  }


  update(camera_controller) {


    camera_controller.camera.quaternion.copy(camera_controller.reference_rotation);
    // camera_controller.camera.quaternion.slerp(camera_controller.reference_rotation, 0.8);

    this.tmp_forward.copy(this.vector_forward_axis);
    let dir = this.tmp_forward.applyQuaternion(camera_controller.camera.quaternion);

    camera_controller.reference_zoom = THREE.Math.clamp(camera_controller.reference_zoom,
      camera_controller.min_zoom, camera_controller.max_zoom);


    camera_controller.camera.position.copy(camera_controller.reference_position).sub(dir.multiplyScalar(camera_controller.reference_zoom));

    camera_controller.camera.up.copy(new THREE.Vector3(0, 1, 0).applyQuaternion(camera_controller.camera.quaternion));
    camera_controller.camera.lookAt(camera_controller.reference_position);

    camera_controller.__last_reference_position.copy(camera_controller.reference_position);

  }

  get_target_camera_pos(camera_controller) {
    this.tmp_quat.copy(camera_controller.reference_rotation);
    this.tmp_forward.copy(this.vector_forward_axis);

    let dir = this.tmp_forward.applyQuaternion(this.tmp_quat);

    let zoom = THREE.Math.clamp(camera_controller.reference_zoom,
      camera_controller.min_zoom, camera_controller.max_zoom);


    this.tmp_camera_target_pos.copy(camera_controller.reference_position).sub(dir.multiplyScalar(zoom));
    return this.tmp_camera_target_pos;

  }

}
