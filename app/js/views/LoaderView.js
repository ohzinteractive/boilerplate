import { ApplicationView } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { Time } from 'ohzi-core';
import { Configuration } from 'ohzi-core';
import { MathUtilities } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

import { Mesh } from 'three';
import { OrthographicCamera } from 'three';
import { Scene } from 'three';
import { Math as TMath } from 'three';

import FPSCounter from '../components/FPSCounter';

export default class LoaderView extends ApplicationView
{
  constructor(api)
  {
    super({
      name: Sections.LOADER,
      url: SectionsURLs.LOADER,
      container: document.querySelector('.loader')
    });

    this.api = api;

    this.is_assets_ready = false;
    this.is_api_ready = false;

    this.current_progress = 0;
    this.target_progress = 0;

    this.compilation_index = 0;

    this.texture_initialized = false;
    this.ao_initialized = false;
    this.mesh_compiled = false;

    this.compilation_t = 0;
    this.performance_t = 0;

    this.objects = [];
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    // SceneController.on_loader_loaded();

    this.progress_bar = document.querySelector('.loader__progress-bar-fill');

    this.set_progress(0);
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    super.on_exit();
  }

  set_progress(progress)
  {
    // this.target_progress = this.__round(progress / 3, 1);
    this.target_progress = this.__round(progress, 2);
  }

  set_api_ready(is_api_ready)
  {
    this.is_api_ready = is_api_ready;
  }

  on_assets_ready()
  {
    // Optionally compile objects during loading
    // Field.set_textures();
    // this.objects = Field.get_objects();

    this.is_assets_ready = true;

    if (process.env.NODE_ENV === 'development')
    {
      this.api.start_main_app();
      this.set_progress(1);
    }
  }

  update_progress()
  {
    // this.progress = this.target_progress + this.round((transition_progress / 3) * 2, 2);
    this.current_progress += (this.target_progress - this.current_progress) * 0.05;
    this.current_progress = TMath.clamp(this.current_progress, 0, 1);

    this.progress_bar.style.transform = `translate3d(${this.current_progress * 100}%,0,0)`;
  }

  update()
  {
    this.update_progress();
    this.__compile_objects();

    if (this.is_api_ready)
    {
      this.api.start_main_app();
    }
  }

  update_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.set_opacity(global_view_data.loader_opacity);

    this.update_progress();
    this.__compile_objects();
    this.__check_performance();
  }

  __check_performance()
  {
    if (this.performance_t > 5 && FPSCounter.avg < 40)
    {
      Configuration.dpr -= 0.25;
      Configuration.dpr = TMath.clamp(Configuration.dpr, 0.75, 10);

      this.performance_t = 0;
    }

    this.performance_t += Time.delta_time;
  }

  __compile_objects()
  {
    if (this.is_assets_ready)
    {
      let scene = new Scene();
      this.compilation_t += Time.delta_time;

      if (this.compilation_index < this.objects.length)
      {
        // console.log(this.compilation_index, this.objects.length);
        const progress = MathUtilities.linear_map(
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
        this.set_api_ready(true);
      }
    }
  }

  __round(value, precision)
  {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
