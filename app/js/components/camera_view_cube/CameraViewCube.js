import Cube from 'js/core/primitives/Cube';
import IdleViewState from './states/IdleViewState';
import VerticalPlane from 'js/core/primitives/VerticalPlane';
import HorizontalPlane from 'js/core/primitives/HorizontalPlane';
import ResourceContainer from 'js/core/ResourceContainer';
import Capabilities from 'js/core/Capabilities';

export default class CameraViewCube extends THREE.Object3D {
	constructor(camera_controller, orientation_offset, viewport, viewport_camera, bounding_box)
	{
		super();
		this.bounding_box = bounding_box;

		this.camera_controller = camera_controller;
		this.viewport = viewport;
		this.viewport_camera = viewport_camera;
		this.cube = this.get_view_cube(orientation_offset);
		// this.cube.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ),THREE.Math.degToRad(-orientation_offset));

		this.current_state = new IdleViewState();

		this.front_plane = new VerticalPlane(undefined, undefined, "#00FF00");
		this.front_plane.position.z = 0.51;
		this.front_plane.userData = {
			tilt: 0,
			orientation: 0
		};

		this.back_plane = new VerticalPlane(undefined, undefined, "#0000FF");
		this.back_plane.position.z = -0.51;
		this.back_plane.rotation.y = 3.14;
		this.back_plane.userData = {
			tilt: 0,
			orientation: 180
		};

		this.left_plane = new VerticalPlane(undefined, undefined, "#E05000");
		this.left_plane.position.x = -0.51;
		this.left_plane.rotation.y = -3.14/2;
		this.left_plane.userData = {
			tilt: 0,
			orientation: 270
		};
		this.right_plane = new VerticalPlane(undefined, undefined, "#E05000");
		this.right_plane.position.x = 0.51;
		this.right_plane.rotation.y = 3.14/2;
		this.right_plane.userData = {
			tilt: 0,
			orientation: 90
		};


		this.top_plane = new HorizontalPlane(undefined, undefined, "#F050F0");
		this.top_plane.position.y = 0.51;
		this.top_plane.userData = {
			tilt: 90,
			orientation: 0
		};

		this.top_front_right_corner = new Cube(new THREE.Vector3(0.35, 0.35, 0.35), undefined, "#FFFF00");
		this.top_front_right_corner.position.y = 0.51;
		this.top_front_right_corner.position.z = 0.51;
		this.top_front_right_corner.position.x = 0.51;
		this.top_front_right_corner.position.multiplyScalar(0.7);
		this.top_front_right_corner.userData = {
			tilt: 45,
			orientation: 45
		};

		this.top_front_left_corner = new Cube(new THREE.Vector3(0.35, 0.35, 0.35), undefined, "#FFFF00");
		this.top_front_left_corner.position.y = 0.51;
		this.top_front_left_corner.position.z = 0.51;
		this.top_front_left_corner.position.x = -0.51;
		this.top_front_left_corner.position.multiplyScalar(0.7);
		this.top_front_left_corner.userData = {
			tilt: 45,
			orientation: 315
		};

		this.top_back_left_corner = new Cube(new THREE.Vector3(0.35, 0.35, 0.35), undefined, "#FFFF00");
		this.top_back_left_corner.position.y = 0.51;
		this.top_back_left_corner.position.z = -0.51;
		this.top_back_left_corner.position.x = -0.51;
		this.top_back_left_corner.position.multiplyScalar(0.7);
		this.top_back_left_corner.userData = {
			tilt: 45,
			orientation: 225
		};

		this.top_back_right_corner = new Cube(new THREE.Vector3(0.35, 0.35, 0.35), undefined, "#FFFF00");
		this.top_back_right_corner.position.y = 0.51;
		this.top_back_right_corner.position.z = -0.51;
		this.top_back_right_corner.position.x = 0.51;
		this.top_back_right_corner.position.multiplyScalar(0.7);
		this.top_back_right_corner.userData = {
			tilt: 45,
			orientation: 135
		};

		this.add(this.cube);
		this.cube.add(this.front_plane);
		this.cube.add(this.back_plane);
		this.cube.add(this.top_plane);
		this.cube.add(this.right_plane);
		this.cube.add(this.left_plane);
		this.cube.add(this.top_front_right_corner);
		this.cube.add(this.top_front_left_corner);
		this.cube.add(this.top_back_left_corner);
		this.cube.add(this.top_back_right_corner);

		this.raycasting_planes = [
			this.front_plane, 
			this.back_plane,
			this.left_plane,
			this.top_front_right_corner,
			this.top_front_left_corner,
			this.top_back_left_corner,
			this.top_back_right_corner,
			this.right_plane,
			this.top_plane
		];

		for(let i=0; i< this.raycasting_planes.length; i++)
		{
			this.raycasting_planes[i].position.y += 0.5;
			this.raycasting_planes[i].material.visible = false;
			this.raycasting_planes[i].material.transparent = true;
			this.raycasting_planes[i].renderOrder = 1;
			// let orientation = this.raycasting_planes[i].userData.orientation;
			// orientation = (orientation + orientation_offset) % 360;
			// this.raycasting_planes[i].userData.orientation = orientation;
		}

		this.project_north_bar = new THREE.Mesh(
			new THREE.BoxBufferGeometry(0.075, 0.005, 0.9),
			new THREE.MeshBasicMaterial({color : 0x000000})
		);
		this.project_north_bar.geometry.translate(0,-0.5,-0.5);
		this.project_north_bar.rotation.y = Math.PI / 180 * orientation_offset
		this.add(this.project_north_bar);
	}

	get_view_cube(orientation_offset)
	{
    let view_cube = ResourceContainer.get_resource("view_cube").scene;
    view_cube.position.y -= 0.5;
    view_cube.traverse((child)=>{
    	child.scale.set(1,1,1);
    	if(child.type === "Mesh")
    	{
  			child.material = new THREE.MeshBasicMaterial();
    		if(child.name === "view_cube")
    		{
    			child.material.transparent = true;
    			child.renderOrder = 0;
    			child.material.map = ResourceContainer.get_resource("view_cube_png");
    			child.material.map.anisotropy = Capabilities.max_anisotropy;
    			child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
    			child.material.map.magFilter = THREE.LinearFilter;
    			child.material.map.generateMipMaps = true;
    		}
    		if(child.name === "view_cube_base")
    		{
    			child.renderOrder = -1;

    			child.rotation.y = (Math.PI / 180 * orientation_offset);

    			child.scale.set(1.5,1.5,1.5);
    			child.position.y = -0.01

    			child.material.transparent = true;
    			child.material.side = THREE.DoubleSide;
    			child.material.map = ResourceContainer.get_resource("view_cube_base_png");
    			child.material.map.anisotropy = Capabilities.max_anisotropy;
    			child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
    			child.material.map.magFilter = THREE.LinearFilter;
    			child.material.map.generateMipMaps = true;
    		}
    	}
    });
    return view_cube;
	}

	update()
	{
		this.current_state.update(this);

    	this.viewport_camera.quaternion.copy(this.camera_controller.camera.quaternion);
    	let forward = new THREE.Vector3(0,0,10);
    	forward.applyQuaternion(this.viewport_camera.quaternion);
    	this.viewport_camera.position.copy(forward);
    
	}

	set_state(new_state)
	{
		// console.log("state switch to ", new_state.constructor.name)
		this.current_state.on_exit(this);
		this.current_state = new_state;
		this.current_state.on_enter(this);
	}
}
