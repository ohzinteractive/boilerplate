import {  ResourceContainer } from 'ohzi-core';
// import { Time } from 'ohzi-core';
// import { Graphics } from 'ohzi-core';

// import { Scene } from 'three';
// import { Mesh } from 'three';
// import { OrthographicCamera } from 'three';
// import { SpotLight } from 'three';
// import { DirectionalLight } from 'three';

export default class ObjectsCompilator
{
  constructor(objects = [], resource_names = [])
  {
    this.compilation_index = 0;

    this.objects = objects;
    this.mesh_compiled = false;
    this.compilation_t = 0;

    this.finished = false;

    this.resource_names = resource_names;

    this.objects_filled = false;
  }

  get_progress()
  {
    return this.compilation_index / this.objects.length;
  }

  update()
  {
    // this.compilation_t += Time.delta_time;
    // const scene = new Scene();

    // this.__fill_objects();

    // if (this.compilation_index < this.objects.length)
    // {
    //   const spot_light = new SpotLight();
    //   spot_light.castShadow = true;

    //   const directional_light = new DirectionalLight();
    //   directional_light.castShadow = true;

    //   const mesh = new Mesh(this.objects[this.compilation_index].geometry, this.objects[this.compilation_index].material);

    //   scene.add(mesh);
    //   scene.add(spot_light);
    //   scene.add(directional_light);

    //   if (this.compilation_t >= 0.016)
    //   {
    //     this.compilation_t = 0;

    //     // 1: Objects
    //     if (!this.mesh_compiled)
    //     {
    //       Graphics._renderer.compile(scene, new OrthographicCamera(-1000, 1000, 1000, -1000, -1000, 1000));
    //       this.mesh_compiled = true;
    //       console.log('Mesh compiled:', this.objects[this.compilation_index].name);
    //     }

    //     scene.remove(mesh);

    //     if (this.mesh_compiled)
    //     {
    //       this.compilation_index++;
    //       this.mesh_compiled = false;
    //     }
    //   }
    // }
    // else
    // {
    this.finished = true;
    // }
  }

  __fill_objects()
  {
    if (!this.objects_filled)
    {
      // console.log('fill objects');
      for (let i = 0; i < this.resource_names.length; i++)
      {
        const resource_name = this.resource_names[i];
        // console.log(resource_name);

        ResourceContainer.get(resource_name).scene.traverse(child =>
        {
          if (child.geometry)
          {
            if (child.type === 'Mesh')
            {
              this.objects.push(child);
              // console.log(child);
            }
          }
        });
      }

      this.objects_filled = true;
    }
  }
}
