import PlaneDragResolver from 'js/core/raycast/PlaneDragResolver';
import SceneManager from 'js/core/SceneManager';
import Input from 'js/core/Input';
import CameraUtilities from 'js/core/utilities/CameraUtilities';

export default class UpdateCameraPosition extends PlaneDragResolver
{
	constructor(camera_controller)
	{
		super();
		this.camera_controller = camera_controller;
		this.last_point = new THREE.Vector3();
		this.delta_offset = new THREE.Vector3();
		this.tmp_quaternion = new THREE.Quaternion();
    this.last_NDC_mouse = new THREE.Vector2();

    this.tmp_contact_point = new THREE.Vector3();
    this.tmp_last_contact_point = new THREE.Vector3();

	}


	on_drag_start(contact_point)
	{
    this.last_NDC_mouse.copy(Input.NDC);
	}
	on_drag_move(contact_point){
		let ref_pos = this.camera_controller.reference_position.clone();
		ref_pos.y = 0;
		this.tmp_contact_point.copy(CameraUtilities.get_plane_intersection(ref_pos,new THREE.Vector3(0,1,0)));
		this.tmp_last_contact_point.copy(CameraUtilities.get_plane_intersection(ref_pos,new THREE.Vector3(0,1,0), this.last_NDC_mouse));
		let delta = this.tmp_contact_point.sub(this.tmp_last_contact_point);


		this.camera_controller.reference_position.x -= delta.x;
		this.camera_controller.reference_position.z -= delta.z;

    this.last_NDC_mouse.copy(Input.NDC);


	}
}