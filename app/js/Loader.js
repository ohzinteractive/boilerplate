import { ResourceContainer } from 'ohzi-core';
import { ResourceBatch } from 'ohzi-core';

import config from 'url:/public/data/config.json';

export default class Loader
{
  constructor(api)
  {
    this.loader = undefined;
    this.progress_bar = undefined;
    this.second_step = false;

    this.api = api;
  }

  load()
  {
    this.loader = document.querySelector('.loader');
    this.progress_bar = document.querySelector('.loader__progress-bar-fill');

    let batch = new ResourceBatch();

    batch.add_json('config', config);

    batch.load(ResourceContainer);

    this.check_resource_loading(batch, this.on_config_ready.bind(this));
  }

  on_config_ready()
  {
    this.second_step = true;

    let config = ResourceContainer.get_resource('config');

    let batch = new ResourceBatch();

    // batch.add_texture("fisheye_tex", "textures/snapshot_250.jpg");
    // batch.add_texture("point", "textures/point.png");

    // batch.add_json('cameras_example', 'data/cameras.json')

    batch.load(ResourceContainer);

    this.check_resource_loading(batch, this.on_api_ready.bind(this));
  }

  on_api_ready()
  {
    this.loader.classList.add('hidden');

    this.api.resource_loading_completed();
    this.api.start();
  }

  check_resource_loading(batch, on_resources_loaded)
  {
    if (this.second_step)
    {
      this.progress_bar.style.width = `${batch.get_progress() * 100}%`;
    }

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
      }.bind(this), 200);
    }
  }
}
