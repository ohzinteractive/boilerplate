
import { Graphics, OMath, Time } from 'ohzi-core';

import { Mesh, OrthographicCamera, Scene } from 'three';

class LoaderSceneController
{
  constructor(view)
  {
    this.view = view;
    this.is_assets_ready = false;

    this.compilation_index = 0;
    this.objects = [];

    this.texture_initialized = false;
    this.ao_initialized = false;
    this.mesh_compiled = false;

    this.compilation_t = 0;
  }

  start()
  {
  }

  before_enter()
  {
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
    this.__compile_objects();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.__compile_objects();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }

  on_assets_ready()
  {
    this.is_assets_ready = true;
    // Optionally compile objects during loading
    // Field.set_textures();
    // this.objects = Field.get_objects();
  }

  __compile_objects()
  {
    if (this.is_assets_ready)
    {
      const scene = new Scene();
      this.compilation_t += Time.delta_time;

      if (this.compilation_index < this.objects.length)
      {
        // console.log(this.compilation_index, this.objects.length);
        const progress = OMath.linear_map(
          this.compilation_index,
          0, 21,
          0.8, 1
        );

        this.set_progress(progress);
        if (this.compilation_t >= 0.025)
        {
          scene.add(new Mesh(this.objects[this.compilation_index].geometry, this.objects[this.compilation_index].material));
          this.compilation_t = 0;

          // 3: Shaders
          if (!this.mesh_compiled && this.ao_initialized)
          {
            Graphics._renderer.compile(scene, new OrthographicCamera(-1000, 1000, 1000, -1000, -1000, 1000));
            this.mesh_compiled = true;
          }

          // 2: Ambient Occlusion
          if (!this.ao_initialized && this.texture_initialized)
          {
            // Graphics._renderer.initTexture(this.objects[this.compilation_index].material.aoMap);
            this.ao_initialized = true;
          }
          // 1: map
          if (!this.texture_initialized)
          {
            if (this.objects[this.compilation_index].material.map)
            {
              Graphics._renderer.initTexture(this.objects[this.compilation_index].material.map);
            }
            this.texture_initialized = true;
          }

          scene.remove(this.objects[this.compilation_index]);

          if (this.texture_initialized && this.ao_initialized && this.mesh_compiled)
          {
            this.compilation_index++;
            this.texture_initialized = false;
            this.ao_initialized = false;
            this.mesh_compiled = false;
          }
        }
      }

      else
      {
        this.view.__set_api_ready(true);
      }
    }
  }
}

export { LoaderSceneController };
