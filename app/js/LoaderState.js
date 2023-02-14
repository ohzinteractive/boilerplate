import { BaseApplication } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';
import { OMath } from 'ohzi-core';

import { GeneralLoader } from './loaders/GeneralLoader';

import { InitialView } from './views/InitialView';
import { LoaderView } from './views/loader/LoaderView';

import loader_data from '../data/transitions/loader.json';

import { SectionsURLs } from './views/Sections';
import { default_state_data } from '../data/default_state_data';

class LoaderState extends BaseApplication
{
  constructor(api)
  {
    super();

    this.api = api;
    this.loader_view = undefined;

    this.loaders = [];
    this.current_loader = undefined;
    this.current_loader_index = 0;

    this.second_step = false;
  }

  // Do not add any assets here. Use GeneralLoader or a specific loader.
  init()
  {
    // this.__redirect_invalid_url();

    // Uncomment this if you need initial config in your project
    // let batch = new ResourceBatch();
    // batch.add_json('config', 'data/config.json', 2000);
    // batch.load(ResourceContainer);
    // this.check_resource_loading(batch, this.on_config_ready.bind(this), 10);

    this.on_config_ready();
    this.__setup_debug_mode();
  }

  on_enter()
  {
    this.loader_view.start();
  }

  on_config_ready()
  {
    ResourceContainer.set_resource('loader_data', 'data/loader.json', loader_data);

    this.initial_view = new InitialView();
    this.loader_view = new LoaderView(this.api);

    ViewManager.set_default_state_data(default_state_data);
    ViewManager.set_view(this.initial_view.name);

    // Start render loop
    this.api.start();

    this.on_loader_ready();
  }

  on_loader_ready()
  {
    this.second_step = true;

    // let config = ResourceContainer.get('config');

    ViewManager.go_to_view(this.loader_view.name, false);

    this.loaders.push(new GeneralLoader(ResourceContainer));

    this.current_loader = this.loaders[this.current_loader_index];
    this.current_loader.load();
  }

  on_assets_ready()
  {
    this.second_step = false;
    // this.loader_view.set_progress(1);
    this.loader_view.on_assets_ready();
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
    if (this.second_step)
    {
      const progress = OMath.linear_map(
        this.__get_progress(),
        0, 1,
        0, 1
      );

      this.loader_view.set_progress(progress);

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

  __redirect_invalid_url()
  {
    const sections_urls = Object.values(SectionsURLs);

    if (!sections_urls.includes(window.location.pathname))
    {
      window.location.replace('/');
    }
  }

  __setup_debug_mode()
  {
    let debug_mode = localStorage.getItem('debug_mode');
    window.debug_mode = debug_mode === 'true';

    let skip_mode = localStorage.getItem('skip_mode');
    window.skip_mode = skip_mode === 'true';

    if (debug_mode === 'true')
    {
      const sections_containers = document.querySelectorAll('.section');

      for (let i = 0; i < sections_containers.length; i++)
      {
        const section_container = sections_containers[i];

        section_container.classList.add('debug');
      }
    }

    document.addEventListener('keydown', event =>
    {
      if (event.shiftKey && event.key === 'D')
      {
        if (debug_mode === 'true')
        {
          debug_mode = 'false';
          document.querySelector('.lil-gui.autoPlace').style.display = 'flex';
        }
        else
        {
          debug_mode = 'true';
        }

        localStorage.setItem('debug_mode', debug_mode);
        location.reload();
      }

      if (event.shiftKey && event.key === 'S')
      {
        if (skip_mode === 'true')
        {
          skip_mode = 'false';
        }
        else
        {
          skip_mode = 'true';
        }

        localStorage.setItem('skip_mode', skip_mode);
        location.reload();
      }
    });
  }
}

export { LoaderState };
