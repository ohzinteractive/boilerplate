import { Configuration, Graphics, Initializer } from 'ohzi-core';

import package_json from '../../package.json';
import { LoaderState } from './LoaderState';

// APP
import { GraphicsInitializer } from './GraphicsInitializer';
import { MainApplication } from './MainApplication';
import { OffscreenManager } from './OffscreenManager';
import { ParamsHandler } from './ParamsHandler';
import { Input } from './components/Input';

class Api
{
  init(settings)
  {
    this.params_handler = new ParamsHandler();
    this.debug_mode = this.params_handler.debug_mode;

    this.application = new MainApplication();

    this.loader = new LoaderState(this);

    this.config = Configuration;

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

    this.resize_observer = new ResizeObserver(this.on_canvas_resize.bind(this));
    this.resize_observer.observe(canvas);

    this.use_offscreen_canvas = !!canvas.transferControlToOffscreen;

    const window_params = {
      chrome: !!window.chrome,
      opr: !!window.opr
    };

    if (this.use_offscreen_canvas)
    {
      const offscreen_canvas = canvas.transferControlToOffscreen();

      OffscreenManager.init(this);

      OffscreenManager.post('init', {
        canvas: offscreen_canvas,
        window_params,
        core_attributes,
        context_attributes,
        threejs_attributes,
        debug_mode: this.debug_mode
      }, [offscreen_canvas]);
    }
    else
    {
      // TODO: Finish backward implementation
      GraphicsInitializer.init(canvas, core_attributes, context_attributes, threejs_attributes);

      Initializer.init(Input, window_params);
    }

    Configuration.dpr = 1;
    // Configuration.dpr = window.devicePixelRatio;

    this.application.init(this.debug_mode);

    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;
    window.author = 'OHZI INTERACTIVE';
    window.version = package_json.version;

    this.loader.init();
  }

  on_canvas_resize(entries)
  {
    if (this.use_offscreen_canvas)
    {
      OffscreenManager.on_canvas_resize(entries);
    }
    else
    {
      Graphics.on_resize(entries);
    }
  }

  dispose()
  {
    this.application.dispose();
    Initializer.dispose();

    OffscreenManager.post('dispose');
    Input.dispose();
  }

  set_settings(settings)
  {
    window.settings = settings;
  }

  start()
  {
    const data = { pathname: window.location.pathname, search: window.location.search };

    OffscreenManager.post('start', data);

    this.application.on_enter();
  }

  stop()
  {
    OffscreenManager.post('stop');
  }

  // Called from worker
  update()
  {
    this.application.update();
  }

  // take_screenshot(callback = (blob) => this.download_blob(blob))
  // {
  //   Graphics.take_screenshot(callback);
  // }

  // download_blob(blob)
  // {
  //   Graphics.download_screenshot(blob);
  // }
}

const api = new Api();
export { api as Api };
