import { BaseApplication } from 'ohzi-core';
import { CameraManager } from 'ohzi-core';
import { PerspectiveCamera } from 'ohzi-core';
import { Screen } from 'ohzi-core';
import { CameraUtilities } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { Components } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';
import { Input } from 'ohzi-core';

import CameraController from '/js/components/CameraController/CameraController';
import SphereSpawn from '/js/components/SphereSpawn';

import line_vert from '/shaders/line_ss/line_ss.vert';
import line_frag from '/shaders/line_ss/line_ss.frag';

import FrustumPointFitter from '/js/components/FrustumPointFitter';

export default class MainApplication extends BaseApplication {
	constructor(renderer) {
		super();
		this.renderer = renderer;

		this.camera_controller = new CameraController();
		this.normal_render_mode = new NormalRender();

    document.querySelector('canvas').addEventListener('contextmenu', (event) =>
    {
      event.preventDefault()
      ;
    }, false);
    document.addEventListener('gesturestart', function(e)
    {
      e.preventDefault();
    });
    document.addEventListener('gestureend', function(e)
    {
      e.preventDefault();
    });

	}

  create_line(points, color = 0x0000ff)
  {
    var material = new THREE.LineBasicMaterial({
      color: color
    });

    var geometry = new THREE.BufferGeometry().setFromPoints( points );

    var line = new THREE.Line( geometry, material );
    SceneManager.current.add( line );
    line.frustumCulled = false;
    return line;
  }

  set_line_direction(line, origin, dir)
  {
    line.geometry.setFromPoints([origin, origin.clone().add(dir)]);
    line.geometry.needsUpdate = true;
  }

	start() {
		Graphics.set_state(this.normal_render_mode);

		this.__init_camera();
		this.__init_camera_controller();

		this.config = ResourceContainer.get_resource("config");
    Debug.draw_axis();

    SceneManager.current.add(new Components.Grid());


    console.log(ResourceContainer.get_resource("light_test"))
    // this.spheres = new SphereSpawn();


    let target_point_positions = [];

    // target_point_positions.push(new THREE.Vector3(-1, 0, 1))
    // target_point_positions.push(new THREE.Vector3( 0.5, 0, 1))
    // target_point_positions.push(new THREE.Vector3( 0.3, 0, 0.5))
    // target_point_positions.push(new THREE.Vector3( -0.1, 0, -0.2))
    // target_point_positions.push(new THREE.Vector3( 0,0,2))
    // target_point_positions.push(new THREE.Vector3( 0,1,2))
    // target_point_positions.push(new THREE.Vector3( 0.5,-1,4));

    // let json_points = [{"x":-322.32080078125,"y":2.4226787090301514,"z":-163.35084533691406},{"x":192.4222869873047,"y":2.4226787090301514,"z":-163.35084533691406},{"x":-322.32080078125,"y":6.267759799957275,"z":-163.35084533691406},{"x":-322.32080078125,"y":2.4226787090301514,"z":135.9759979248047},{"x":192.4222869873047,"y":2.4226787090301514,"z":135.9759979248047},{"x":-322.32080078125,"y":6.267759799957275,"z":135.9759979248047},{"x":192.4222869873047,"y":6.267759799957275,"z":135.9759979248047},{"x":192.4222869873047,"y":6.267759799957275,"z":-163.35084533691406}];
    let json_points = [{"x":-541.535400390625,"y":15.8685302734375,"z":-359.9420471191406},{"x":201.04718017578125,"y":15.8685302734375,"z":-359.9420471191406},{"x":-541.535400390625,"y":29.420156478881836,"z":-359.9420471191406},{"x":-541.535400390625,"y":15.8685302734375,"z":333.54833984375},{"x":201.04718017578125,"y":15.8685302734375,"z":333.54833984375},{"x":-541.535400390625,"y":29.420156478881836,"z":333.54833984375},{"x":201.04718017578125,"y":29.420156478881836,"z":333.54833984375},{"x":201.04718017578125,"y":29.420156478881836,"z":-359.9420471191406}];
    for (let i = 0; i < json_points.length; i++) {
      target_point_positions.push(new THREE.Vector3(parseFloat(json_points[i].x), parseFloat(json_points[i].y), parseFloat(json_points[i].z)));
    }

    this.up_lines = [];
    this.down_lines = [];
    let scale = 0.1;
    for(let i=0; i< target_point_positions.length; i++)
    {
      target_point_positions[i].multiplyScalar(scale);
      Debug.draw_sphere(target_point_positions[i], 1, 0x55aa55);
      this.up_lines.push(Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,scale,0)], 0x00ff00));
      this.down_lines.push(Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,scale,0)], 0xff0000));
    }

    this.pull_back_dir_line = Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,scale,0)], 0x00ff00);


    this.right_frustum_line   = Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,1,0)], 0xff0000);
    this.left_frustum_line    = Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,1,0)], 0xff00ff);
    this.up_frustum_line      = Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,1,0)], 0x00ff00);
    this.bottom_frustum_line  = Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,1,0)], 0x00ffff);

    console.log(this.right_frustum_line)
    this.right_frustum_line.visible = true;
    this.left_frustum_line.visible = true;
    this.up_frustum_line.visible = true;
    this.bottom_frustum_line.visible = true;

    this.target_positions = target_point_positions;

    this.sphere = new THREE.Sphere().setFromPoints(target_point_positions);

    this.up_plane_helper   = new THREE.PlaneHelper( new THREE.Plane(), 50, 0x00ff00 )
    this.down_plane_helper = new THREE.PlaneHelper( new THREE.Plane(), 50, 0xff0000 )

    this.left_plane_helper   = new THREE.PlaneHelper( new THREE.Plane(), 50, 0xff0000 )
    this.right_plane_helper  = new THREE.PlaneHelper( new THREE.Plane(), 50, 0x0000ff )

    // SceneManager.current.add(this.up_plane_helper)
    // SceneManager.current.add(this.down_plane_helper)

    // SceneManager.current.add(this.left_plane_helper)
    // SceneManager.current.add(this.right_plane_helper)


    this.camera_far_sphere = Debug.draw_sphere(undefined, undefined, 0xffff00);
    this.camera_correct_sphere = Debug.draw_sphere(undefined,undefined,0x00ff00);
    // this.camera_far_sphere.visible = false;
    // this.camera_correct_sphere.visible = false;


    this.closest_point_to_plane = Debug.draw_sphere(undefined, 2, 0x00ff00);
    this.closest_point_to_plane.visible = false



    this.focus_enabled = true;


    this.tilt = 0;
    this.orientation = 0;

    this.last_NDC = new THREE.Vector2();
	}

	update() {

   

    if(Input.left_mouse_button_down)
    {
      let mouse_delta_dir = Input.NDC.clone().sub(this.last_NDC);
      this.tilt += mouse_delta_dir.y*-200;
      this.orientation += mouse_delta_dir.x *-200;

    }

    this.last_NDC.copy(Input.NDC);


    // let camera_quaternion = this.camera_controller.build_rotation(this.tilt, this.orientation);

    let camera_quaternion = this.camera_controller.camera.quaternion;
    let camera_forward_dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera_quaternion);
    

    let fitter = new FrustumPointFitter();

    let camera_pos = fitter.fit_points(this.target_positions, camera_quaternion, CameraManager.current.fov, CameraManager.current.aspect)

    // CameraManager.current.position.copy(camera_pos)
    // CameraManager.current.quaternion.copy(camera_quaternion)


    let reference_position_plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0,1,0), fitter.sphere.center);

    let camera_ray = new THREE.Ray(camera_pos, camera_forward_dir);

    let reference_position = new THREE.Vector3();
    camera_ray.intersectPlane(reference_position_plane, reference_position);

    let zoom = camera_pos.distanceTo(reference_position);

    this.camera_controller.reference_zoom = zoom;
    this.camera_controller.reference_position.copy(reference_position)

    this.camera_controller.update();


    return;

    // this.camera_controller.update();


    if(Input.right_mouse_button_pressed)
    {
      this.focus_enabled = !this.focus_enabled;
    }

    
	}

  
  update_frustum_lines(camera_position, camera_quaternion)
  {
    let v_fov = THREE.Math.degToRad(CameraManager.current.fov/2);
    let h_fov = (2 * Math.atan(Math.tan(v_fov) * CameraManager.current.aspect))/2;

    let up_plane_normal = new THREE.Vector3(0,0,-1);
    up_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), v_fov));
    up_plane_normal.applyQuaternion(camera_quaternion);

    let down_plane_normal = new THREE.Vector3(0,0,-1);
    down_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -v_fov));
    down_plane_normal.applyQuaternion(camera_quaternion);


    let left_plane_normal = new THREE.Vector3(0,0,-1);
    left_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), h_fov));
    left_plane_normal.applyQuaternion(camera_quaternion);

    let right_plane_normal = new THREE.Vector3(0,0,-1);
    right_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -h_fov));
    right_plane_normal.applyQuaternion(camera_quaternion);

    this.up_frustum_line.geometry.setFromPoints([camera_position.clone(), camera_position.clone().add(up_plane_normal.clone().multiplyScalar(100))])
    this.up_frustum_line.geometry.needsUpdate = true;

    this.right_frustum_line.geometry.setFromPoints([camera_position.clone(), camera_position.clone().add(right_plane_normal.clone().multiplyScalar(100))])
    this.right_frustum_line.geometry.needsUpdate = true;

    this.left_frustum_line.geometry.setFromPoints([camera_position.clone(), camera_position.clone().add(left_plane_normal.clone().multiplyScalar(100))])
    this.left_frustum_line.geometry.needsUpdate = true;

    this.bottom_frustum_line.geometry.setFromPoints([camera_position.clone(), camera_position.clone().add(down_plane_normal.clone().multiplyScalar(100))])
    this.bottom_frustum_line.geometry.needsUpdate = true;

  }

	__init_camera() {
		let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 20000);
		camera.updateProjectionMatrix();
		camera.position.z = 10;

		camera.clear_color.copy(new THREE.Color("#000000"));
		camera.clear_alpha = 1;
		CameraManager.current = camera;
	}

	__init_camera_controller() {
		this.camera_controller.set_camera(CameraManager.current);
		this.camera_controller.set_idle();
    this.camera_controller.set_debug_mode();

		this.camera_controller.min_zoom = 1;
		this.camera_controller.max_zoom = 20000;
		this.camera_controller.reference_zoom = 30;
    this.camera_controller.reference_position.set(0, 0, 0);
		this.camera_controller.set_rotation(0,0);

	}


}
