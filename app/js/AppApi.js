import { Graphics, ResourceBatch } from 'ohzi-core';
import { RenderLoop } from 'ohzi-core';
import { Configuration } from 'ohzi-core';
import { EventManager } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { Input } from 'ohzi-core';
import Loader from './loader';

// APP
import MainApplication from './MainApplication';

class AppApi
{
  constructor()
  {
    this.application = new MainApplication(Graphics);

    this.render_loop = new RenderLoop(this.application, Graphics);
    this.config = Configuration;

    window.ViewApi = this;
  }

  init()
  {
    let app_container = document.querySelector('.container');
    let canvas = document.querySelector('.main-canvas');

    Graphics.init(canvas, { antialias: true });
    Configuration.dpr = window.devicePixelRatio;

    Input.init(app_container, canvas);
    Debug.init(Graphics);
  }

  load(settings)
  {
    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;

    let loader = new Loader(this);
    loader.load();
  }

  dispose()
  {
    this.render_loop.stop();
    Graphics._renderer.dispose();
  }

  draw_debug_axis()
  {
    Debug.draw_axis();
  }

  on_orientation_change()
  {

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
    this.ResourceContainer.set_resource(name, resource);
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
