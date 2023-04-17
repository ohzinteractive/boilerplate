import { Graphics } from 'ohzi-core';
import { RenderLoop } from 'ohzi-core';
import { Configuration } from 'ohzi-core';
import { Initializer } from 'ohzi-core';

// import { EventManager } from 'ohzi-core';
// import { Debug } from 'ohzi-core';
// import { ResourceContainer } from 'ohzi-core';

import package_json from '../../package.json';
import { LoaderState } from './LoaderState';

// APP
import { MainApplication } from './MainApplication';
import { Input } from './components/Input';

class Api
{
  init(settings)
  {
    this.application = new MainApplication();

    this.loader = new LoaderState(this);

    this.render_loop = new RenderLoop(this.loader, Graphics, Input);
    this.config = Configuration;

    const app_container = document.querySelector('.container');
    const canvas = document.querySelector('.main-canvas');

    const graphics_attributes = {
      antialias: true,
      force_webgl2: true,
      xr_enabled: false
    };

    Input.init(app_container, document);
    Initializer.init(canvas, graphics_attributes, Input);
    // Configuration.dpr = 1;
    Configuration.dpr = window.devicePixelRatio;

    this.application.init(Graphics);

    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;
    window.author = 'OHZI INTERACTIVE';
    window.version = package_json.version;

    this.loader.init();
  }

  dispose()
  {
    this.application.dispose();
    Initializer.dispose(this.render_loop);
    Input.dispose();
  }

  // draw_debug_axis()
  // {
  //   Debug.draw_axis();
  // }

  // register_event(name, callback)
  // {
  //   EventManager.on(name, callback);
  // }

  // set_resource(name, resource)
  // {
  //   ResourceContainer.set_resource(name, resource);
  // }

  set_settings(settings)
  {
    window.settings = settings;
  }

  start_main_app()
  {
    this.render_loop.set_state(this.application);
  }

  start()
  {
    this.render_loop.start();
  }

  stop()
  {
    this.render_loop.stop();
  }

  take_screenshot(callback = (blob) => this.download_blob(blob))
  {
    Graphics.take_screenshot(callback);
  }

  download_blob(blob)
  {
    Graphics.download_screenshot(blob);
  }
}

const api = new Api();
export { api as Api };
