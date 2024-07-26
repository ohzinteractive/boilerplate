import { Graphics, Initializer, RenderLoop } from 'ohzi-core';

// import { Debug } from 'ohzi-core';
// import { ResourceContainer } from 'ohzi-core';

import package_json from '../../package.json';
import { LoaderState } from './LoaderState';

// APP
import { Input } from './components/Input';
// import { BasisInitializer } from './initializers/BasisInitializer';
// import { DracoInitializer } from './initializers/DracoInitializer';
import { DebugModeController } from './components/DebugModeController';
import { GraphicsInitializer } from './initializers/GraphicsInitializer';
import { MainApplication } from './MainApplication';
import { Settings } from './Settings';

class Api
{
  init()
  {
    this.debug_mode_controller = new DebugModeController();
    Settings.debug_mode = this.debug_mode_controller.debug_mode;

    this.application = new MainApplication();

    this.loader = new LoaderState(this);

    this.render_loop = new RenderLoop(this.application, Graphics, Input);

    const app_container = document.querySelector('.container');
    const canvas = document.querySelector('.main-canvas');

    const core_attributes = {
      force_webgl2: true,
      xr_enabled: false
    };

    const context_attributes = {
      antialias: true,
      preserveDrawingBuffer: true
    };

    const threejs_attributes = {
      logarithmicDepthBuffer: false
    };

    Input.init(app_container, document);
    Initializer.init(Input);

    Settings.dpr = 1;
    // Settings.dpr = window.devicePixelRatio;

    const graphics_initializer = new GraphicsInitializer();
    graphics_initializer.init(canvas, core_attributes, context_attributes, threejs_attributes);

    // const draco_initializer = new DracoInitializer();
    // draco_initializer.init();

    // const basis_initializer = new BasisInitializer();
    // basis_initializer.init();

    this.application.init(Graphics);

    window.app = this.application;
    window.ViewApi = this;
    window.author = 'OHZI Interactive Studio';
    window.version = package_json.version;

    this.loader.init();

    this.resize_observer = new ResizeObserver(this.on_canvas_resize.bind(this));
    this.resize_observer.observe(canvas);
  }

  on_canvas_resize(entries)
  {
    Graphics.on_resize(entries, Settings.dpr);
  }

  dispose()
  {
    this.application.dispose();
    Initializer.dispose(this.render_loop);
    Input.dispose();
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
