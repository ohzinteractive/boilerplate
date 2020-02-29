import ViewBaseState from './ViewBaseState';
import TransitionViewState from './TransitionViewState';
import Input from 'js/core/Input';
import Screen from 'js/core/Screen';
import MathUtilities from 'js/core/utilities/MathUtilities';

export default class IdleViewState extends ViewBaseState
{
	constructor()
	{
		super();

		this.raycaster = new THREE.Raycaster();

		this.tmp_mouse_pos = new THREE.Vector2();
		this.tmp_new_mouse_pos = new THREE.Vector2();
	}

	update(camera_view_cube)
	{


		this.tmp_mouse_pos.copy(Input.mouse_pos);

		let new_mouse_pos = new THREE.Vector2();

		new_mouse_pos.x = this.tmp_mouse_pos.x - camera_view_cube.viewport.x;
		new_mouse_pos.y = (Screen.height-this.tmp_mouse_pos.y) - camera_view_cube.viewport.y;


		new_mouse_pos.x /= camera_view_cube.viewport.z;
		new_mouse_pos.y /= camera_view_cube.viewport.w;
		new_mouse_pos.x = new_mouse_pos.x * 2.0 - 1.0;
		new_mouse_pos.y = new_mouse_pos.y * 2.0 - 1.0;

		this.hide_planes(camera_view_cube);
		
		let intersected_plane = this.check_raycasting(camera_view_cube, new_mouse_pos);

		if(intersected_plane !== undefined && 
				MathUtilities.between(new_mouse_pos.x, -1, 1) && 
				MathUtilities.between(new_mouse_pos.y, -1, 1))
		{
			intersected_plane.material.visible = true;
			if(Input.left_mouse_button_down)
			{
				let data = intersected_plane.userData;
				camera_view_cube.set_state(new TransitionViewState(	data.tilt, data.orientation));
			}
		}

	}

	hide_planes(camera_view_cube)
	{
		for(let i=0; i < camera_view_cube.raycasting_planes.length; i++)
		{
			camera_view_cube.raycasting_planes[i].material.visible = false;
		}
	}

	check_raycasting(camera_view_cube, NDC)
	{

		this.raycaster.setFromCamera(NDC, camera_view_cube.viewport_camera);
		let intersections = this.raycaster.intersectObjects( camera_view_cube.raycasting_planes );
		if(intersections.length > 0)
		{
			return intersections[0].object;
		}
		return undefined;

	}
}
