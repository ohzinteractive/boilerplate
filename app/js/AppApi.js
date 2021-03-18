import { Graphics, ResourceBatch } from 'ohzi-core';
import { RenderLoop } from 'ohzi-core';
import { Configuration } from 'ohzi-core';
import { EventManager } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { Initializer } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import Loader from './Loader';

// APP
import MainApplication from './MainApplication';

class AppApi
{
  init()
  {
    this.application = new MainApplication();

    this.render_loop = new RenderLoop(this.application, Graphics);
    this.config = Configuration;

    let app_container = document.querySelector('.container');
    let canvas = document.querySelector('.main-canvas');

    Initializer.init(canvas, app_container, { antialias: true });
    Configuration.dpr = window.devicePixelRatio;

    this.application.init(Graphics);
  }

  load(settings)
  {
    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;

    this.init();

    let loader = new Loader(this);
    loader.load();
  }

  dispose()
  {
    this.application.dispose();
    Initializer.dispose(this.render_loop);
  }

  draw_debug_axis()
  {
    Debug.draw_axis();
  }

  register_event(name, callback)
  {
    EventManager.on(name, callback);
  }

  resource_loading_completed()
  {
    this.application.resources_fully_loaded();
  }

  set_resource(name, resource)
  {
    ResourceContainer.set_resource(name, resource);
  }

  set_settings(settings)
  {
    window.settings = settings;
  }

  start()
  {
    this.render_loop.start();
  }

  stop()
  {
    this.render_loop.stop();
  }
}

const Api = new AppApi();
export { Api, ResourceBatch };
