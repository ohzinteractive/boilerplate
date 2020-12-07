import { Graphics, ResourceBatch } from 'ohzi-core';
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
    let canvas_container = document.querySelector('.canvas-container');
    let canvas = document.querySelector('.main-canvas');

    Configuration.dpr = window.devicePixelRatio;
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

  on_orientation_change: () =>
  {

  },

  on_resize: () =>
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
  ResourceContainer: ResourceContainer,
  ResourceBatch: ResourceBatch
};
