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

export default class MainApplication extends BaseApplication {
	constructor(renderer) {
		super();
		this.renderer = renderer;

		this.camera_controller = new CameraController();
		this.normal_render_mode = new NormalRender();

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

    // this.spheres = new SphereSpawn();


    let target_point_positions = [];

    // target_point_positions.push(new THREE.Vector3(-1, 0, 1))
    // target_point_positions.push(new THREE.Vector3( 0.5, 0, 1))
    // target_point_positions.push(new THREE.Vector3( 0.3, 0, 0.5))
    // target_point_positions.push(new THREE.Vector3( -0.1, 0, -0.2))
    // target_point_positions.push(new THREE.Vector3( 0,0,2))
    // target_point_positions.push(new THREE.Vector3( 0,1,2))
    // target_point_positions.push(new THREE.Vector3( 0.5,-1,4))


    this.up_lines = [];
    this.down_lines = [];
    for(let i=0; i< target_point_positions.length; i++)
    {
      target_point_positions[i].multiplyScalar(10);
      Debug.draw_sphere(target_point_positions[i], 1, 0x55aa55);
      this.up_lines.push(Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,10,0)], 0x00ff00));
      this.down_lines.push(Debug.draw_line([new THREE.Vector3(), new THREE.Vector3(0,10,0)], 0xff0000));
    }



    this.target_positions = target_point_positions;

    // this.sphere = new THREE.Sphere().setFromPoints(target_point_positions);

    // this.up_plane_helper   = new THREE.PlaneHelper( new THREE.Plane(), 50, 0x00ff00 )
    // this.down_plane_helper = new THREE.PlaneHelper( new THREE.Plane(), 50, 0xff0000 )

    // this.left_plane_helper   = new THREE.PlaneHelper( new THREE.Plane(), 50, 0xf000ff )
    // this.right_plane_helper  = new THREE.PlaneHelper( new THREE.Plane(), 50, 0xff00f0 )

    // SceneManager.current.add(this.up_plane_helper)
    // SceneManager.current.add(this.down_plane_helper)

    // SceneManager.current.add(this.left_plane_helper)
    // SceneManager.current.add(this.right_plane_helper)


    // this.camera_far_sphere = Debug.draw_sphere();
    // this.camera_correct_sphere = Debug.draw_sphere(undefined,undefined,0x00ff00);
    // this.camera_far_sphere.visible = false;
    // this.camera_correct_sphere.visible = false;


    // this.closest_point_to_plane = Debug.draw_sphere(undefined, 2, 0x0f0fa0);
    // this.closest_point_to_plane.visible = false



    this.focus_enabled = true;

    let line = new Components.Line();
    line.setup([new THREE.Vector3(), new THREE.Vector3(2,0,0)]);

    let line_material = new THREE.ShaderMaterial({
      uniforms: {
        _Thickness: { value: 5 },
        _ScreenSize: { value: new THREE.Vector2(1,1) }
      },
      vertexShader: line_vert,
      fragmentShader: line_frag,
      transparent: true,
      depthWrite: false,
      extensions: { derivatives: true},
      side: THREE.DoubleSide
    });
    line.material = line_material;
    SceneManager.current.add(line);
    this.line_material = line_material;
	}

	update() {
    this.camera_controller.update();
    this.line_material.uniforms._ScreenSize.value.x = Screen.width;
    this.line_material.uniforms._ScreenSize.value.y = Screen.height;
    return;

    this.camera_controller.reference_position.copy(this.sphere.center);
    if(Input.right_mouse_button_pressed)
    {
      this.focus_enabled = !this.focus_enabled;
    }
    if(this.focus_enabled)
    {

      let v_fov = THREE.Math.degToRad(this.camera_controller.camera.fov/2);

      let h_fov = (2 * Math.atan(Math.tan(v_fov) * CameraManager.current.aspect))/2;

      let up_plane_normal = new THREE.Vector3(0,1,0);
      up_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), v_fov));
      up_plane_normal.applyQuaternion(this.camera_controller.camera.quaternion);

      let down_plane_normal = new THREE.Vector3(0,1,0);
      down_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -v_fov));
      down_plane_normal.applyQuaternion(this.camera_controller.camera.quaternion);


      let left_plane_normal = new THREE.Vector3(1,0,0);
      left_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), h_fov));
      left_plane_normal.applyQuaternion(this.camera_controller.camera.quaternion);

      let right_plane_normal = new THREE.Vector3(1,0,0);
      right_plane_normal.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -h_fov));
      right_plane_normal.applyQuaternion(this.camera_controller.camera.quaternion);





      let far_pos = this.sphere.center.clone().add(CameraUtilities.get_forward_dir().clone().multiplyScalar(50))
      this.camera_far_sphere.position.copy(far_pos)

      let up_plane    = new THREE.Plane().setFromNormalAndCoplanarPoint(up_plane_normal, far_pos);
      let down_plane  = new THREE.Plane().setFromNormalAndCoplanarPoint(down_plane_normal, far_pos);

      let left_plane    = new THREE.Plane().setFromNormalAndCoplanarPoint(left_plane_normal, far_pos);
      let right_plane  = new THREE.Plane().setFromNormalAndCoplanarPoint(right_plane_normal, far_pos);

      this.up_plane_helper.plane    = up_plane
      this.down_plane_helper.plane  = down_plane
      this.left_plane_helper.plane  = left_plane
      this.right_plane_helper.plane = right_plane

      this.up_plane_helper.updateMatrixWorld(true);
      this.down_plane_helper.updateMatrixWorld(true);  
      this.left_plane_helper.updateMatrixWorld(true);
      this.right_plane_helper.updateMatrixWorld(true);  


      let closest_distance = 99999999;

      let closest_point = undefined;
      let inverse_dir = CameraUtilities.get_forward_dir().clone().multiplyScalar(500);
      for (let i = 0; i < this.target_positions.length; i++) 
      {
        

        let line = new THREE.Line3(this.target_positions[i], this.target_positions[i].clone().add(inverse_dir));
        let up_line_intersection  = new THREE.Vector3();
        let down_line_intersection = new THREE.Vector3();

        let left_line_intersection  = new THREE.Vector3();
        let right_line_intersection = new THREE.Vector3();

        up_plane.intersectLine(line,  up_line_intersection);
        down_plane.intersectLine(line, down_line_intersection);

        left_plane.intersectLine(line,  left_line_intersection);
        right_plane.intersectLine(line, right_line_intersection);
        

        


        let new_up_distance   = this.target_positions[i].clone().sub(up_line_intersection).length();
        let new_down_distance = this.target_positions[i].clone().sub(down_line_intersection).length();

        let new_left_distance   = this.target_positions[i].clone().sub(left_line_intersection).length();
        let new_right_distance  = this.target_positions[i].clone().sub(right_line_intersection).length();

        let vertical_min    = Math.min(new_up_distance, new_down_distance);
        let horizontal_min  = Math.min(new_left_distance, new_right_distance);

        let min = Math.min(vertical_min, horizontal_min);

        if(new_up_distance < new_down_distance)
        {
          this.up_lines[i].geometry.setFromPoints([this.target_positions[i], up_line_intersection]);
          this.up_lines[i].geometry.needsUpdate = true;
          this.up_lines[i].visible   = true;
          this.down_lines[i].visible = false;
        }
        else
        {
          this.down_lines[i].geometry.setFromPoints([this.target_positions[i], down_line_intersection]);
          this.down_lines[i].geometry.needsUpdate = true;
          this.down_lines[i].visible = true;
          this.up_lines[i].visible   = false;
        }
        if(min < closest_distance)
        {
          closest_distance = min;
          closest_point = this.target_positions[i].clone();
        }
      }
      this.closest_point_to_plane.position.copy(closest_point)

      this.camera_far_sphere.position.copy(far_pos)



      let forward_correction = CameraUtilities.get_forward_dir().clone().multiplyScalar(closest_distance);
      let closest_position = far_pos.clone().sub(forward_correction);
      this.camera_correct_sphere.position.copy(closest_position);

      let zoom = closest_position.distanceTo(this.sphere.center);
      this.camera_controller.reference_zoom = zoom;

    }

    
	}

	on_resize() {
	}

  post_start(){
  }

	__init_camera() {
		let camera = new PerspectiveCamera(60, Screen.aspect_ratio, 0.1, 200);
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
		this.camera_controller.max_zoom = 4000;
		this.camera_controller.reference_zoom = 30;
    this.camera_controller.reference_position.set(0, 0, 0);
		this.camera_controller.set_rotation(45,0);
	}

}
