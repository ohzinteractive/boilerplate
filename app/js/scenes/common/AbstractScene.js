import { Scene } from 'three';
// import AvatarSystem from '../../components/avatar/AvatarSystem';

import HighQualityAssetsState from './loading_states/HighQualityAssetsState';
import RegularAssetsState from './loading_states/RegularAssetsState';
import SceneLoadingState from './loading_states/SceneLoadingState';

export default class AbstractScene extends Scene
{
  constructor({
    name,
    scene_objects, scene_textures, scene_sounds,
    scene_high_objects, scene_high_textures, scene_high_sounds
  })
  {
    super();

    this.name = name;

    this.is_loaded = false;
    this.is_high_loaded = false;

    this.loading_states = {
      regular: new RegularAssetsState(this, scene_objects, scene_textures, scene_sounds),
      high: new HighQualityAssetsState(this, scene_high_objects, scene_high_textures, scene_high_sounds)
    };

    this.current_state = new SceneLoadingState();
    this.set_state(this.loading_states.regular);
  }

  get loading_progress()
  {
    return this.current_state.loading_progress;
  }

  init()
  {
  }

  load()
  {
    this.init();

    this.set_state(this.loading_states.regular);
    this.current_state.load();
  }

  get_objects()
  {
    const objects = [];

    this.traverse(child =>
    {
      if (child.geometry)
      {
        if (child.type === 'Mesh')
        {
          objects.push(child);
        }
      }
    });

    return objects;
  }

  dispose_cpu()
  {
    this.traverse(child =>
    {
      if (child.geometry)
      {
        child.geometry.attributes.position.array = new Float32Array(3);
        if (child.geometry.attributes.normal)
        {
          child.geometry.attributes.normal.array = new Float32Array(3);
        }
        if (child.geometry.attributes.uv)
        {
          child.geometry.attributes.uv.array = new Float32Array(2);
        }
        if (child.material.map)
        {
          for (let i = 0; i < child.material.map.mipmaps.length; i++)
          {
            child.material.map.mipmaps[i] = new Uint8Array(4);
          }
        }
      }
    });

    // AvatarSystem.component_container.component_instancer.data_texture.data = new Float32Array(4);
  }

  dispose()
  {
    this.traverse(child =>
    {
      if (child.material)
      {
        if (child.material.map)
        {
          child.material.map.dispose();
        }

        child.material.dispose();
        child.geometry.dispose();
      }
    });
    // AvatarSystem.component_container.component_instancer.data_texture.data = new Float32Array(4);
  }

  set_state(state)
  {
    this.current_state.on_exit();
    this.current_state = state;
    this.current_state.on_enter();
  }

  // Called from transition
  update_loading_state()
  {
    if (!this.is_high_loaded)
    {
      this.current_state.update();
    }
  }

  update()
  {
    this.update_loading_state();
  }

  on_assets_ready()
  {
    this.is_loaded = true;

    // Load high quality assets
    this.set_state(this.loading_states.high);
    this.current_state.load();
  }

  on_high_quality_assets_ready()
  {
    this.is_high_loaded = true;
    // If sounds are loaded, this line should be used
    // AudioManager.init_sounds(AudioManager.get_sounds_names(sounds));
  }
}
