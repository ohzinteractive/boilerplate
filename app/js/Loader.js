import { BaseApplication } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ResourceBatch } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';

import InitialView from './views/InitialView';
import LoaderView from './views/LoaderView';

export default class Loader extends BaseApplication
{
  constructor(api)
  {
    super();
    this.loader_view = undefined;
    this.second_step = false;

    this.api = api;
  }

  load()
  {
    let batch = new ResourceBatch();

    batch.add_json('config', 'data/config.json', 2000);

    batch.load(ResourceContainer);

    this.check_resource_loading(batch, this.on_loader_ready.bind(this), 10);
  }

  on_enter()
  {
    this.loader_view.start();
  }

  on_loader_ready()
  {
    this.second_step = true;

    // let config = ResourceContainer.get_resource('config');

    ViewManager.set_initial_state_data({});

    this.initial_view = new InitialView();
    this.loader_view = new LoaderView(this.api);

    ViewManager.set_view(this.initial_view.name);
    ViewManager.go_to_view(this.loader_view.name, false);

    // Start render loop
    this.api.start();

    let batch = new ResourceBatch();

    // batch.add_texture('wood', 'textures/wood.jpg');

    batch.load(ResourceContainer);

    this.check_resource_loading(batch, this.on_assets_ready.bind(this), 10);
  }

  on_assets_ready()
  {
    this.loader_view.on_assets_ready();
  }

  check_resource_loading(batch, on_resources_loaded, timeout)
  {
    // console.log(batch.get_progress(), batch.get_loaded_bytes(), batch.get_total_bytes());
    if (this.second_step)
    {
      this.loader_view.set_progress(batch.get_progress());
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
      }.bind(this), timeout);
    }
  }

  update()
  {
    // SceneController.update();
  }
}
