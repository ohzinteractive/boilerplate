import { Browser, Configuration } from 'ohzi-core';

import package_json from '../../package.json';
import { LoaderState } from './LoaderState';

// APP
import { MainApplication } from './MainApplication';
import { ParamsHandler } from './ParamsHandler';
import { MainThreadApiStrategy } from './api_strategies/MainThreadApiStrategy';
import { OffscreenApiStrategy } from './api_strategies/OffscreenApiStrategy';
import { MainInput } from './components/MainInput';
class Api
{
  init(settings)
  {
    this.params_handler = new ParamsHandler();
    this.debug_mode = this.params_handler.debug_mode;

    this.application = new MainApplication();

    this.loader = new LoaderState(this);

    this.config = Configuration;

    const window_params = {
      chrome: !!window.chrome,
      opr: !!window.opr
    };

    Browser.init(window_params.opr, window_params.chrome);

    const app_container = document.querySelector('.container');
    const canvas = document.querySelector('.main-canvas');

    this.use_offscreen_canvas = !Browser.is_safari && !!canvas.transferControlToOffscreen;

    MainInput.init(app_container, document, this.use_offscreen_canvas);

    this.strategies = {
      main_thread: new MainThreadApiStrategy(this),
      offscreen: new OffscreenApiStrategy(this)
    };

    this.current_strategy = this.use_offscreen_canvas ? this.strategies.offscreen : this.strategies.main_thread;

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

    this.current_strategy.init(canvas, window_params, core_attributes, context_attributes, threejs_attributes, this.application);

    Configuration.dpr = 1;
    // Configuration.dpr = window.devicePixelRatio;

    this.application.init(this.debug_mode, this.use_offscreen_canvas);

    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;
    window.author = 'OHZI INTERACTIVE';
    window.version = package_json.version;

    this.loader.init();

    this.resize_observer = new ResizeObserver(this.on_canvas_resize.bind(this));
    this.resize_observer.observe(canvas);
  }

  on_canvas_resize(entries)
  {
    this.current_strategy.on_canvas_resize(entries);
  }

  dispose()
  {
    this.application.dispose();

    this.current_strategy.dispose();

    MainInput.dispose();

    const old_canvas = document.querySelector('.main-canvas');
    const new_canvas = old_canvas.cloneNode(true);

    old_canvas.parentElement.appendChild(new_canvas);
    old_canvas.remove();
  }

  set_settings(settings)
  {
    window.settings = settings;
  }

  start()
  {
    this.current_strategy.start();
  }

  stop()
  {
    this.current_strategy.stop();
  }

  // Called from worker
  update()
  {
    this.application.update();
  }

  take_screenshot(callback)
  {
    this.current_strategy.take_screenshot(callback);
  }
}

const api = new Api();
export { api as Api };
