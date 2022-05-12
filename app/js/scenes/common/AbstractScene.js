import { Scene } from 'three';
import AudiosCompilator from '../../compilators/AudiosCompilator';

import CompilatorManager from '../../compilators/CompilatorManager';
import ObjectsCompilator from '../../compilators/ObjectsCompilator';
import TexturesCompilator from '../../compilators/TexturesCompilator';

import AsyncAudiosLoader from '../../loaders/AsyncAudiosLoader';
import AsyncObjectsLoader from '../../loaders/AsyncObjectsLoader';
import AsyncTexturesLoader from '../../loaders/AsyncTexturesLoader';

export default class AbstractScene extends Scene
{
  constructor(scene_objects, scene_textures, scene_sounds,
    scene_high_objects, scene_high_textures, scene_high_sounds)
  {
    super();

    this.first_time = true;
    this.callback_called = false;

    this.high_quality_callback_called = false;
    this.scene_high_objects = scene_high_objects;
    this.scene_high_textures = scene_high_textures;
    this.scene_high_sounds = scene_high_sounds;

    this.setup_loader(scene_objects, scene_textures, scene_sounds);
  }

  setup_loader(scene_objects, scene_textures, scene_sounds)
  {
    this.loaders = [];
    this.compilators = [];

    const compilators = [];

    const object_loader = new AsyncObjectsLoader(scene_objects);
    this.loaders.push(object_loader);
    compilators.push(new ObjectsCompilator(this.get_objects(), object_loader.get_assets_names()));

    const textures_loader = new AsyncTexturesLoader(scene_textures);
    this.loaders.push(textures_loader);
    compilators.push(new TexturesCompilator(textures_loader.get_assets_names()));

    const audios_loader = new AsyncAudiosLoader(scene_sounds);
    this.loaders.push(audios_loader);
    compilators.push(new AudiosCompilator(audios_loader.get_assets_names()));

    this.compilator_manager = new CompilatorManager(compilators);
  }

  init()
  {
  }

  load()
  {
    for (let i = 0; i < this.loaders.length; i++)
    {
      const loader = this.loaders[i];
      loader.load();
    }
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

  is_loaded()
  {
    if (this.first_time)
    {
      this.init();
      this.load();
      this.first_time = false;
    }

    let loaded = true;

    for (let i = 0; i < this.loaders.length; i++)
    {
      const loader = this.loaders[i];

      loaded = loaded && loader.is_loaded();
    }

    if (loaded && !this.callback_called)
    {
      this.on_assets_ready();

      // Loader High quality assets
      this.setup_loader(this.scene_high_objects, this.scene_high_textures, this.scene_high_sounds);
      this.load();

      this.callback_called = true;
    }

    return loaded;
  }

  check_high_quality_loaded()
  {
    const loaded = this.is_loaded();

    if (loaded && !this.high_quality_callback_called)
    {
      this.on_high_quality_assets_ready();

      this.high_quality_callback_called = true;
    }

    return loaded;
  }

  is_compiled()
  {
    this.compilator_manager.update();
    return this.compilator_manager.is_finished();
  }

  update()
  {
    this.check_high_quality_loaded();
  }

  on_assets_ready()
  {
    console.warn('Not implemented');
  }

  on_high_quality_assets_ready()
  {
    // If sounds are loaded, this line should be used
    // AudioManager.init_sounds(AudioManager.get_sounds_names(sounds));
  }
}
