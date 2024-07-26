import { BaseApplication } from 'ohzi-core';

import { GeneralLoader } from './loaders/GeneralLoader';

import { LoaderView } from './views/loader/LoaderView';

class LoaderState extends BaseApplication
{
  constructor(api)
  {
    super();

    this.api = api;
    this.loader_view = new LoaderView(api);

    this.loaders = [];
    this.current_loader = undefined;
    this.current_loader_index = 0;

    this.second_step = false;

    this.finished = false;
    this.frame_id = -1;
  }

  // Do not add any assets here. Use GeneralLoader or a specific loader.
  init()
  {
    // Uncomment this if we need initial config in the project
    // let batch = new ResourceBatch('config_loader', ResourceContainer);
    // batch.add_json('config', 'data/config.json', 2000);
    // batch.load();
    // this.check_resource_loading(batch, this.on_config_ready.bind(this), 10);

    this.on_config_ready();

    this.on_enter();
  }

  on_enter()
  {
    this.loader_view.start();

    this.frame_id = requestAnimationFrame(this.update.bind(this));
  }

  on_config_ready()
  {
    this.on_loader_ready();
  }

  on_loader_ready()
  {
    this.second_step = true;

    // let config = ResourceContainer.get('config');

    this.loaders.push(new GeneralLoader());

    this.current_loader = this.loaders[this.current_loader_index];
    this.current_loader.load();
  }

  on_assets_ready()
  {
    this.second_step = false;

    this.finished = true;

    this.loader_view.on_exit();
    this.api.start();
  }

  check_resource_loading(batch, on_resources_loaded, timeout)
  {
    // console.log(batch.get_progress(), batch.get_loaded_bytes(), batch.get_total_bytes());

    if (batch.loading_finished)
    {
      if (batch.has_errors)
      {
        batch.print_errors();
      }
      else
      {
        on_resources_loaded();
      }
    }
    else
    {
      setTimeout(function()
      {
        this.check_resource_loading(batch, on_resources_loaded);
      }.bind(this), timeout);
    }
  }

  update()
  {
    if (this.finished)
    {
      return;
    }

    this.loader_view.update();

    if (this.second_step)
    {
      if (this.current_loader.batch.loading_finished)
      {
        if (this.current_loader.batch.has_errors)
        {
          this.current_loader.batch.print_errors();
        }
        else
        {
          this.__on_current_loader_finished();
        }
      }
    }

    this.frame_id = requestAnimationFrame(this.update.bind(this));
  }

  __on_current_loader_finished()
  {
    this.current_loader_index++;

    if (this.current_loader_index < this.loaders.length)
    {
      this.current_loader = this.loaders[this.current_loader_index];
      this.current_loader.load();
    }
    else
    {
      this.on_assets_ready();
    }
  }

  __get_progress()
  {
    let progress = 0;

    for (let i = 0; i < this.loaders.length; i++)
    {
      const loader = this.loaders[i];

      progress += loader.batch.get_progress();
    }

    return progress / this.loaders.length;
  }
}

export { LoaderState };
