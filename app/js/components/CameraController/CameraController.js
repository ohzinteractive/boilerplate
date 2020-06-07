import CameraViewState from './states/CameraViewState'
import CameraDebugState from './states/CameraDebugState'
// import CameraPanAndZoom from './states/CameraPanAndZoom'
// import FreeMove from './states/FreeMove'
import ImmediateMode from './movement_mode/ImmediateMode'

// import EventManager from 'js/core/EventManager';
// import RotateAndZoomAroundPoint from './movement_mode/RotateAndZoomAroundPoint'
import CameraMovementMode from './movement_mode/CameraMovementMode'

import {Input} from 'ohzi-core';
import {CameraManager} from 'ohzi-core'
import {Screen} from 'ohzi-core';
import {Debug} from 'ohzi-core';
import {MathUtilities} from 'ohzi-core';
import {ArrayUtilities} from 'ohzi-core';
import {SceneManager} from 'ohzi-core';

export default class CameraController
{

	constructor(){
		this.camera = undefined;
		this.camera_initial_rot = undefined;
		this.camera_initial_pos = undefined;
		this.current_state = new CameraViewState();

    this.current_mode = new ImmediateMode();

		this.point_of_interest = new THREE.Vector3();
		this.normalized_zoom = 0;


    this.vector_up_axis   = new THREE.Vector3(0,1,0);
    this.vector_right_axis = new THREE.Vector3(1,0,0);
    this.vector_forward_axis = new THREE.Vector3(0,0,1);
    this.tmp_forward = this.vector_forward_axis.clone();
    this.tmp_right = this.vector_right_axis.clone();

    this.tmp_dir = new THREE.Vector3();

    this.zoom = 10;
    this.reference_zoom = 10;
    this.orientation = 27; // degrees
    this.tilt = 70;


    this.reference_rotation = new THREE.Quaternion();
		this.reference_position = new THREE.Vector3();
		this.__last_reference_position = new THREE.Vector3();



		this.tmp_size = new THREE.Vector3();
		this.tmp_quat = new THREE.Quaternion();

		this.min_zoom = 1;
		this.max_zoom = 400;

		this.current_tilt = 0;
  	this.current_orientation = 0;

  	this.input_enabled = true;
  	// this.debug_box = Debug.draw_cube(undefined,15);
  	// this.debug_zoom_box = Debug.draw_sphere(undefined,15, 0x00ff00);

    this.projected_points = [];
    for(let i=0; i< 30; i++)
    {
      this.projected_points.push(Debug.draw_sphere(undefined,0.5, 0x00ff00));
    }
    this.hide_projected_points();
    this.projection_plane_helper = new THREE.PlaneHelper( new THREE.Plane(), 1, 0xff00 );
    this.projection_plane_helper.visible = false;
    SceneManager.current.add( this.projection_plane_helper );

    this.projection_sphere_helper = Debug.draw_sphere_helper(new THREE.Sphere(), 0xff0000);
    this.projection_sphere_helper.material.transparent = true;
    this.projection_sphere_helper.material.opacity = 0.3;
    this.projection_sphere_helper.visible = false;;
	}

	set_camera(camera)
	{
		this.camera = camera;
		this.camera_initial_rot = camera.quaternion.clone();
		this.camera_initial_pos = camera.position.clone();
	}


	set_state(state)
	{
		// console.log("camera controller state switch to: " + state.constructor.name);
		this.current_state.on_exit(this);
		this.current_state = state;
		this.current_state.on_enter(this);
	}

	set_mode(mode)
	{
		// console.log("camera controller mode switch to: " + mode.constructor.name);

		this.current_mode.on_exit(this);
		this.current_mode = mode;
		this.current_mode.on_enter(this);
	}
	set_normalized_zoom(zoom)
	{
		this.normalized_zoom = THREE.Math.clamp(zoom, 0, 1);
		// EventManager.fire_zoom_changed(this.normalized_zoom);
	}
	update_normalized_zoom(min_zoom, max_zoom)
	{
		let zoom = this.camera.position.distanceTo(this.reference_position);
		this.normalized_zoom = MathUtilities.linear_map(zoom, min_zoom, max_zoom, 1, 0);
		this.normalized_zoom = THREE.Math.clamp(this.normalized_zoom, 0, 1);
		
		// EventManager.fire_zoom_changed(this.normalized_zoom);

	}
	update()
	{
		if(this.debug_box)
  		this.debug_box.position.copy(this.reference_position);

  	// this.debug_zoom_box.position.copy(this.reference_position)
  	// this.debug_zoom_box.position.add(new THREE.Vector3(0,0,1).applyQuaternion(this.camera.quaternion).multiplyScalar(this.reference_zoom));

		this.current_state.update(this);
		this.current_mode.update(this);
		this.update_normalized_zoom(this.min_zoom, this.max_zoom);
	}


	set_idle()
	{
		this.set_state(new CameraViewState());
	}

	camera_is_zoomed_out()
	{
		return this.normalized_zoom < 0.2;
	}

	set_debug_mode()
	{
		this.set_state(new CameraDebugState());
	}



  set_rotation(tilt, orientation)
  {
  	this.old_orientation = this.current_orientation;

  	this.current_tilt = tilt || this.current_tilt;
  	this.current_orientation = orientation || this.current_orientation;
    this.reference_rotation.copy(this.build_rotation(this.current_tilt, this.current_orientation));
  }


  set_tilt(tilt)
  {
    let new_tilt = new THREE.Quaternion().setFromAxisAngle(this.vector_right_axis, (-tilt/360) * Math.PI*2);
    let old_tilt = new THREE.Quaternion().setFromAxisAngle(this.vector_right_axis, (-this.current_tilt/360) * Math.PI*2);
    old_tilt.conjugate();

  	this.reference_rotation.multiply(old_tilt).multiply(new_tilt);
  	this.current_tilt = tilt;

  }

  set_rotation_delta(delta_x, delta_y)
  {

  	this.current_orientation = (this.current_orientation+delta_x) % 360;
  	this.current_tilt += delta_y;

  	this.current_orientation 

  	this.set_rotation(this.current_tilt, this.current_orientation);
  }

  lerp_rotation(from_tilt, to_tilt, from_orientation, to_orientation, t)
  {
  	let raw_orientation = THREE.Math.lerp(from_orientation, to_orientation, t);
  	if(Math.abs(to_orientation - from_orientation) > 180)
  	{
  		if(from_orientation > 180)
  			from_orientation = (from_orientation%360) - 360;
  		if(to_orientation > 180)
  			to_orientation = (to_orientation%360) - 360;
  	}

  	this.set_rotation(THREE.Math.lerp(from_tilt, to_tilt, t), 
  										THREE.Math.lerp(from_orientation, to_orientation, t));
  	this.current_orientation = raw_orientation
  }


  build_rotation(tilt, orientation)
  {
  	let new_orientation = new THREE.Quaternion().setFromAxisAngle(this.vector_up_axis, (orientation/360) * Math.PI*2);
    let new_tilt = new THREE.Quaternion().setFromAxisAngle(this.vector_right_axis, (-tilt/360) * Math.PI*2);

    return new_orientation.multiply(new_tilt);
  }

  translate_forward(amount)
  {
  	this.tmp_forward.copy(this.vector_forward_axis);
  	this.tmp_forward.applyQuaternion(this.camera.quaternion);
  	this.tmp_forward.y = 0;
  	this.tmp_forward.normalize();
  	this.reference_position.add(this.tmp_forward.multiplyScalar(amount));
  }
  translate_right(amount)
  {
  	this.tmp_right.copy(this.vector_right_axis);
  	this.tmp_right.applyQuaternion(this.camera.quaternion);
  	this.reference_position.add(this.tmp_right.multiplyScalar(amount));
  }


  focus_on_bounding_box(bb, scale = 1)
  {
  	if(this.camera.isOrthographicCamera)
  	{
  		bb.getSize(this.tmp_size);

  		let obj_x = this.tmp_size.x;
  		let obj_y = this.tmp_size.y;
  		let object_aspect = obj_x / obj_y;
  		if(Screen.aspect_ratio / object_aspect > 1)
      	this.camera.zoom = Screen.height/obj_y;
	    else
	      this.camera.zoom = Screen.width/obj_x;
	    
	    bb.getCenter(this.reference_position);
  	}
  	else
  	{
  		let dir = new THREE.Vector3();
  		dir.copy(bb.max).sub(bb.min);
    	
  		let p1 = bb.min.clone();


  		let p2 = p1.clone().add(new THREE.Vector3(dir.x, 0,0));
  		let p3 = p1.clone().add(new THREE.Vector3(0, dir.y,0));
  		let p4 = p1.clone().add(new THREE.Vector3(0, 0, dir.z));

  		let p5 = p1.clone().add(new THREE.Vector3(dir.x, 0, dir.z));
  		let p6 = p1.clone().add(new THREE.Vector3(0, dir.y, dir.z));
  		let p7 = bb.max.clone();
  		let p8 = p1.clone().add(new THREE.Vector3(dir.x, dir.y, 0));

  		this.focus_camera_on_points([p1, p2, p3, p4, p5, p6, p7, p8], scale);


  	}
  }
	get_zoom_to_focus_on_bounding_box(bb, tilt, orientation)
	{
		if(tilt !== undefined && orientation !== undefined)
		{
			this.tmp_quat.copy(this.reference_rotation); //backup quaternion
			this.reference_rotation.copy(this.build_rotation(tilt, orientation));
		}
		let original_zoom = this.reference_zoom;
		let original_pos = new THREE.Vector3().copy(this.reference_position);
		this.focus_camera_on_bounding_box(bb);
		let target_zoom = this.reference_zoom;
		this.reference_position.copy(original_pos);
		this.reference_zoom = original_zoom;

		if(tilt !== undefined && orientation !== undefined)
		{
			this.reference_rotation.copy(this.tmp_quat);
		}

		return target_zoom;
	}

	get_zoom_to_focus_on_points(points, scale)
	{
		let old_zoom = this.reference_zoom;
		let old_pos = new THREE.Vector3().copy(this.reference_position);
		this.focus_camera_on_points(points, scale);
		let new_zoom = this.reference_zoom;
		this.reference_zoom = old_zoom;
		this.reference_position.copy(old_pos);
		return new_zoom;
	}
	get_target_pos_to_focus_on_points(points, scale)
	{
		let old_zoom = this.reference_zoom;
		let old_pos = new THREE.Vector3().copy(this.reference_position);
		this.focus_camera_on_points(points, scale);
		let new_pos = this.reference_zoom.clone();
		this.reference_zoom = old_zoom;
		this.reference_position.copy(old_pos);
		return new_pos;
	}

	focus_camera_on_sphere(sphere, debug)
	{
		this.reference_zoom = this.get_zoom_to_sphere(sphere, debug);
		this.reference_position.copy(sphere.center);
	}

	get_zoom_to_sphere(sphere, debug)
	{
		
		let v_fov = (this.camera.fov/2) * Math.PI/180;
		let h_fov = (2 * Math.atan(Math.tan(v_fov) * this.camera.aspect))/2;

		// if(debug )
		// {
		// 	Debug.draw_math_sphere(sphere);
		// }
		//this.camera.zoom = 1/((sphere.radius*2) /(ViewApi.map.camera_controller.camera.top*2));
    // this.camera.updateProjectionMatrix();

    let distV = sphere.radius / Math.tan(v_fov);
    let distH = sphere.radius / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
	}

  hide_projected_points()
  {
    for(let i=0; i< this.projected_points.length; i++)
    {
      this.projected_points[i].visible = false; 
    }
  }
  show_projected_points(points)
  {
    this.hide_projected_points();
    for(let i=0; i< points.length; i++)
    {
      this.projected_points[i].visible = true; 
      this.projected_points[i].position.copy(points[i]); 
    }
  }

  show_plane_projection(plane, size = 1)
  {
    this.projection_plane_helper.plane = plane;
    this.projection_plane_helper.size = size;
    this.projection_plane_helper.updateMatrixWorld()
    this.projection_plane_helper.visible = true;
  }

  show_sphere_projection(sphere)
  {
    this.projection_sphere_helper.scale.set(sphere.radius, sphere.radius,sphere.radius);
    this.projection_sphere_helper.position.copy(sphere.center);
    this.projection_sphere_helper.visible = true;;
  }

	focus_camera_on_points(points, zoom_scale = 1, debug)
  {
    let points_sphere = new THREE.Sphere().setFromPoints(points);
    let world_space_center = points_sphere.center;
    let camera_forward = new THREE.Vector3(0,0,1).applyQuaternion(this.reference_rotation)
    // let near_plane = points_sphere.center.clone().add(camera_forward.clone().multiplyScalar(points_sphere.radius));

    let far_pos =  this.camera.position.clone().add(camera_forward.clone().multiplyScalar(100));
    let near_plane = ArrayUtilities.get_closest_point(points, far_pos).clone();

    let plane = new THREE.Plane().setFromNormalAndCoplanarPoint(camera_forward, near_plane);
    let points_on_plane = [];

    // this.show_plane_projection(plane, points_sphere.radius*2);
    // this.show_sphere_projection(points_sphere);
    let _projected_points = [];

    for(let i=0; i< points.length; i++)
    {
      let projected_point = new THREE.Vector3();

      plane.projectPoint(points[i], projected_point);
      projected_point.copy(points[i])
      // let line = new THREE.Line3(points[i].clone(), this.camera.position.clone());
      // plane.intersectLine(line, projected_point);

      points_on_plane.push(projected_point.clone());
      _projected_points.push(projected_point.clone())
    }

    this.show_projected_points(_projected_points);







































    let up = new THREE.Vector3(0,1,0).applyQuaternion(this.reference_rotation)
    let right = up.clone().cross(camera_forward).normalize();

    let mat = new THREE.Matrix4().set(  right.x, up.x, camera_forward.x, world_space_center.x,
                                        right.y, up.y, camera_forward.y, world_space_center.y,
                                        right.z, up.z, camera_forward.z, world_space_center.z,
                                              0,    0,                0,        1);

    let inverse_mat = new THREE.Matrix4().getInverse(mat);
    // let inverse_mat = this.camera.matrixWorldInverse.clone();

    for(let i=0; i< points_on_plane.length; i++)
    {
      points_on_plane[i].applyMatrix4(inverse_mat);
    }

    let size = new THREE.Vector3();
    let box =  new THREE.Box3().setFromPoints(points_on_plane);
    box.getSize(size);
    // size.multiplyScalar(zoom_scale);
    
    let projected_center = new THREE.Vector3();
    box.getCenter(projected_center);



    this.reference_position.copy(projected_center.applyMatrix4(mat).sub(camera_forward.clone().multiplyScalar(points_sphere.radius)));

    // let zoom_scale_nofake = 1 + (zoom_scale-1)*2;
    // this.reference_zoom = this.__get_zoom_to_show_rect((size.x/2)*zoom_scale_nofake, (size.y/2)*zoom_scale_nofake)+points_sphere.radius;
    this.reference_zoom = this.__get_zoom_to_show_rect((size.x/2), (size.y/2), 1+(1-zoom_scale))+points_sphere.radius;
  }

	get_current_tilt()
	{
		return this.current_tilt;
	}
	get_current_orientation()
	{
		return this.current_orientation;
	}

  __get_zoom_to_show_rect(width,height, scale = 1)
  {
    // let v_fov = (this.camera.fov/2) * Math.PI/180;
    let v_fov = THREE.Math.degToRad(this.camera.fov/2);
    let h_fov = (2 * Math.atan(Math.tan(v_fov) * this.camera.aspect))/2;


    let distV = height / Math.tan(v_fov*scale);
    let distH = width / Math.tan(h_fov*scale);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }
}
