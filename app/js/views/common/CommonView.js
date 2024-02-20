import { ApplicationView, ResourceContainer } from 'ohzi-core';
import { AudiosCompilator } from '../../compilators/AudiosCompilator';
import { CompilatorManager } from '../../compilators/CompilatorManager';
import { AsyncAudiosLoader } from '../../loaders/AsyncAudiosLoader';

class CommonView extends ApplicationView
{
  start()
  {
    super.start();

    this.loaders = [];
    this.compilators = [];

    this.audio_loaded = false;
  }

  before_enter()
  {
    super.before_enter();

    if (!this.audio_loaded)
    {
      // TODO: study where should we call this
      this.setup_loader();

      this.loaders[0].load();
    }
  }

  setup_loader()
  {
    this.loaders = [];
    this.compilators = [];

    const assets_worker = ResourceContainer.get('assets_worker');

    const audios_loader = new AsyncAudiosLoader(this.name, this.sounds_data, assets_worker);
    this.loaders.push(audios_loader);
    this.compilators.push(new AudiosCompilator(this.sounds_data));

    this.compilator_manager = new CompilatorManager(this.compilators);
  }

  is_loaded()
  {
    let loaded = true;

    for (let i = 0; i < this.loaders.length; i++)
    {
      const loader = this.loaders[i];

      loaded = loaded && loader.is_loaded();
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
    super.update();

    if (!this.audio_loaded)
    {
      if (this.is_loaded())
      {
        if (this.is_compiled())
        {
          this.audio_loaded = true;
        }
      }
    }
  }
}

export { CommonView };
