import CameraManager from 'js/core/CameraManager';
import Input from 'js/core/Input';
import PlaneRaycastResolver from 'js/core/raycast/PlaneRaycastResolver';
import CameraUtilities from 'js/core/utilities/CameraUtilities';

export default class PlaneRaycaster
{
	constructor(raycast_resolver)
	{
		this.raycast_resolver = raycast_resolver || new PlaneRaycastResolver();
		
		this.raycaster = new THREE.Raycaster();
		this.current_intersected_point = new THREE.Vector3();

	}

	update(reference_position, plane_normal)
	{
		this.current_intersected_point.copy(CameraUtilities.get_plane_intersection(reference_position, plane_normal));
  	this.raycast_resolver.on_hover(this.current_intersected_point);
	}
}