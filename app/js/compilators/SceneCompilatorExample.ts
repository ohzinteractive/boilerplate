import { Graphics, OS, PerspectiveCamera } from 'ohzi-core';
import type { Object3D } from 'three';
import { BoxGeometry, Mesh, MeshBasicMaterial, RenderTarget } from 'three';
// import { sRGBEncoding } from 'three';
import { AbstractScene, Compilator } from 'ohzi-core';
import { InstancedMesh, PointLight, SkinnedMesh, Layers as THREELayers } from 'three';
import { Layers } from '../Layers';

export class SceneCompilator extends Compilator
{
  RT: RenderTarget;
  camera: PerspectiveCamera;
  compiled_mesh_i: number;
  instanced_mesh: InstancedMesh;
  instanced_scene: AbstractScene;
  mesh: Mesh;
  meshes: Object3D[];
  original_scene: AbstractScene;
  post_processing_layers: THREELayers;
  scene: AbstractScene;
  skinned_mesh: SkinnedMesh;
  skinned_scene: AbstractScene;
  started: boolean;

  constructor(scene: AbstractScene)
  {
    super();
    
    this.original_scene = scene;
    this.meshes = [];

    this.compiled_mesh_i = 0;

    this.mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    this.mesh.frustumCulled = false;

    this.scene = new AbstractScene({ name: 'Scene', compilators: {} });
    this.scene.add(this.mesh);
    this.scene.add(new PointLight());

    this.skinned_mesh = new SkinnedMesh(new BoxGeometry(), new MeshBasicMaterial());
    this.skinned_mesh.frustumCulled = false;

    this.skinned_scene = new AbstractScene({ name: 'SkinnedScene', compilators: {} });
    this.skinned_scene.add(this.skinned_mesh);
    this.skinned_scene.add(new PointLight());

    this.instanced_mesh = new InstancedMesh(new BoxGeometry(), new MeshBasicMaterial(), 1);
    this.instanced_mesh.frustumCulled = false;

    this.instanced_scene = new AbstractScene({ name: 'InstancedScene', compilators: {} });
    this.instanced_scene.add(this.instanced_mesh);
    this.instanced_scene.add(new PointLight());

    this.scene.environment = scene.environment;
    this.skinned_scene.environment = scene.environment;
    this.instanced_scene.environment = scene.environment;

    this.camera = new PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.layers.enable(Layers.reflectable);
    this.camera.layers.enable(Layers.bloom);
    this.camera.layers.enable(Layers.occluder);
    this.camera.layers.enable(Layers.instanced_occluder);

    this.RT = new RenderTarget(1, 1);

    this.started = false;

    this.post_processing_layers = new THREELayers();
    this.post_processing_layers.set(Layers.reflectable);
    this.post_processing_layers.enable(Layers.bloom);
    this.post_processing_layers.enable(Layers.occluder);
    this.post_processing_layers.enable(Layers.instanced_occluder);

    // this.progress_elem = document.createElement('div');
    // document.body.appendChild(this.progress_elem);

    // this.progress_elem.style = `position: absolute; z-index: 9999; transform: translate( ${OScreen.width / 2}px, ${OScreen.height / 2}px);`;
    // this.progress_elem.innerText = `Compiling shaders: 0/${this.meshes.length}`;
    // const bounding_rect = this.progress_elem.getBoundingClientRect();
    // this.progress_elem.style.left = -bounding_rect.width / 2 + 'px';
  }

  start()
  {
    this.meshes = this.original_scene.get_objects();
    this.started = true;
  }

  update()
  {
    if (this.finished === false) // this.started &&
    {
      const time_compiling = 60; // in frames

      const objects_to_compile = OS.is_ios ? 1 : Math.ceil(this.meshes.length / time_compiling);

      this.compile_objects(objects_to_compile);
      // this.progress_elem.innerText = `Compiling shaders: ${this.compiled_mesh_i}/${this.meshes.length}`;

      // if (this.finished)
      // {
      //   this.progress_elem.parentElement.removeChild(this.progress_elem);
      // }
    }
  }

  // get finished()
  // {
  //   if (!this.started)
  //   {
  //     return false;
  //   }

  //   return this.compiled_mesh_i === this.meshes.length;
  // }

  compile_objects(count: number)
  {
    for (let i = 0; i < count; i++)
    {
      if (this.finished)
      {
        return;
      }

      const m = this.meshes[this.compiled_mesh_i];
      // console.log('compiling', m.name);

      if ((m as SkinnedMesh).skeleton)
      {
        this.skinned_mesh.geometry = (m as SkinnedMesh).geometry;
        this.skinned_mesh.material = (m as SkinnedMesh).material;
        this.skinned_mesh.skeleton = (m as SkinnedMesh).skeleton;
        this.skinned_mesh.morphTargetInfluences = (m as SkinnedMesh).morphTargetInfluences;
        Graphics.render(this.skinned_scene, this.camera);
        if (m.layers.test(this.post_processing_layers))
        {
          Graphics.render(this.skinned_scene, this.camera, this.RT);
        }
      }
      else
      {
        if ((m as InstancedMesh).instanceMatrix)
        {
          this.instanced_mesh.geometry = (m as InstancedMesh).geometry;
          this.instanced_mesh.material = (m as InstancedMesh).material;
          this.instanced_mesh.instanceMatrix = (m as InstancedMesh).instanceMatrix;
          this.instanced_mesh.count = (m as InstancedMesh).count;
          Graphics.render(this.instanced_scene, this.camera);
          if (m.layers.test(this.post_processing_layers))
          {
            Graphics.render(this.instanced_scene, this.camera, this.RT);
          }
        }
        else
        {
          this.mesh.geometry = (m as Mesh).geometry;
          this.mesh.material = (m as Mesh).material;
          Graphics.render(this.scene, this.camera);
          if (m.layers.test(this.post_processing_layers))
          {
            Graphics.render(this.scene, this.camera, this.RT);
          }
        }
      }

      this.compiled_mesh_i++;
    }
  }
}
