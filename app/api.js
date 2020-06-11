import { Graphics } from 'ohzi-core';
import { RenderLoop } from 'ohzi-core';
import { Configuration } from 'ohzi-core';
import { EventManager } from 'ohzi-core';
import { Debug } from 'ohzi-core';
import { Input } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';

// APP
import MainApplication from './MainApplication';

const application = new MainApplication(Graphics);
const render_loop = new RenderLoop(application, Graphics);

window.ViewApi = {
  init: (parameters) =>
  {
    let body = document.querySelector('body');
    let canvas = document.getElementById('main-canvas');

    Configuration.is_mobile = parameters.is_mobile;
    Configuration.is_ios = parameters.is_ios;
    Configuration.is_ipad = parameters.is_ipad;

    Graphics.init(canvas);

    Input.init(body, canvas);
    Debug.init(Graphics);
  },

  dispose: () =>
  {
    render_loop.stop();
    Graphics._renderer.dispose();
  },

  draw_debug_axis: () =>
  {
    Debug.draw_axis();
  },

  register_event: (name, callback) =>
  {
    EventManager.on(name, callback);
  },

  resize_canvas: () =>
  {
    application.on_resize();
  },

  resource_loading_completed: () =>
  {
    application.resources_fully_loaded();
  },

  set_resource: (name, resource) =>
  {
    ResourceContainer.set_resource(name, resource);
  },

  start: () =>
  {
    render_loop.start();
  },

  stop: () =>
  {
    render_loop.stop();
  },

  application: application,
  config: Configuration,
  resource_container: ResourceContainer
};
