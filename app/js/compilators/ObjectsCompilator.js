// import { ResourceContainer } from 'ohzi-core';
import { PerspectiveCamera } from 'ohzi-core';
import { Time } from 'ohzi-core';
import { Graphics } from 'ohzi-core';

import { Scene } from 'three';
import { Mesh } from 'three';
// import { OrthographicCamera } from 'three';
// import { BoxGeometry } from 'three';
// import { SpotLight } from 'three';
// import { DirectionalLight } from 'three';

class ObjectsCompilator
{
  // objects came empty
  constructor(scene)
  {
    this.compilation_index = 0;

    this.objects = [];
    this.mesh_compiled = false;
    this.compilation_t = 0;

    this.finished = false;

    // this.resource_names = resource_names;

    this.scene = scene;

    this.objects_filled = false;
  }

  get_progress()
  {
    return this.compilation_index / this.objects.length;
  }

  update()
  {
    this.compilation_t += Time.delta_time;
    const scene = new Scene();

    this.__fill_objects();

    if (process.env.NODE_ENV === 'development')
    {
      this.finished = true;
    }

    if (this.compilation_index < this.objects.length)
    {
      // const spot_light = new SpotLight();
      // spot_light.castShadow = true;

      // const directional_light = new DirectionalLight();
      // directional_light.castShadow = true;

      // const geometry = new BoxGeometry(1, 1, 1);
      // // const material = new MeshBasicMaterial( {color: 0x00ff00} );
      // const mesh = new Mesh(geometry, this.objects[this.compilation_index].material);
      // scene.add(mesh);

      const mesh = new Mesh(this.objects[this.compilation_index].geometry, this.objects[this.compilation_index].material);

      // const name = this.objects[this.compilation_index].name;
      // mesh.material.onBeforeCompile = (shader, renderer) =>
      // {
      //   console.log(mesh.material.constructor.name, name);
      // };
      scene.add(mesh);

      // scene.add(spot_light);
      // scene.add(directional_light);

      if (this.compilation_t >= 0.016)
      {
        this.compilation_t = 0;

        if (!this.mesh_compiled)
        {
          // console.time(name);
          // Graphics._renderer.compile(scene, new OrthographicCamera(-1000, 1000, 1000, -1000, -1000, 1000));
          // Graphics.render(scene, new OrthographicCamera(-1000, 1000, 1000, -1000, -1000, 1000));
          Graphics.render(scene, new PerspectiveCamera(1));
          // console.timeEnd(name);
          // console.log('Mesh compiled:', this.objects[this.compilation_index].name);

          this.mesh_compiled = true;
        }

        scene.remove(mesh);

        if (this.mesh_compiled)
        {
          this.compilation_index++;
          this.mesh_compiled = false;
        }
      }
    }
    else
    {
      this.finished = true;
      console.log('finish compilation');
    }
  }

  __fill_objects()
  {
    if (!this.objects_filled)
    {
      this.objects = this.scene.get_objects();

      this.objects_filled = true;
    }
  }
}

export { ObjectsCompilator };
