
import { Browser } from 'ohzi-core';
import package_json from '../../package.json';
import { LoaderState } from './LoaderState';

// APP
import { MainApplication } from './MainApplication';
import { ParamsHandler } from './ParamsHandler';
import { Settings } from './Settings';
import { MainThreadApiStrategyWrapper } from './api_strategies/MainThreadApiStrategyWrapper';
import { OffscreenApiStrategy } from './api_strategies/OffscreenApiStrategy';
import { MainInput } from './components/MainInput';
class Api
{
  async init(settings)
  {
    this.params_handler = new ParamsHandler();

    const window_params = {
      chrome: !!window.chrome,
      opr: !!window.opr
    };

    const app_container = document.querySelector('.container');
    const canvas = document.querySelector('.main-canvas');

    Browser.init(window_params.opr, window_params.chrome);
    const use_offscreen_canvas = !Browser.is_safari && !!canvas.transferControlToOffscreen;

    Settings.set_debug_mode(this.params_handler.debug_mode);
    Settings.set_use_offscreen_canvas(use_offscreen_canvas);
    Settings.set_dpr(1);
    // Settings.set_dpr(window.devicePixelRatio);

    this.application = new MainApplication();
    this.loader = new LoaderState(this);

    MainInput.init(app_container, document);

    this.strategies = {
      main_thread: new MainThreadApiStrategyWrapper(),
      offscreen: new OffscreenApiStrategy()
    };

    this.current_strategy = use_offscreen_canvas ? this.strategies.offscreen : this.strategies.main_thread;

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

    await this.current_strategy.init({
      api: this,
      canvas,
      window_params,
      core_attributes,
      context_attributes,
      threejs_attributes,
      application: this.application
    });

    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;
    window.author = 'OHZI INTERACTIVE';
    window.version = package_json.version;

    await this.application.init();
    this.loader.init();

    this.resize_observer = new ResizeObserver(this.on_canvas_resize.bind(this));
    this.resize_observer.observe(canvas);

    this.__bind_parcel_events();
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

  __bind_parcel_events()
  {
    // Parcel stuff
    if (module.hot)
    {
      module.hot.accept((data) =>
      {
        // setTimeout(() =>
        // {
        //   location.reload();
        // }, 200);
        // module or one of its dependencies was just updated.
      });

      module.hot.dispose((data) =>
      {
        setTimeout(() =>
        {
          // module is about to be replaced.
          location.reload();
        }, 200);
      });
    }
  }
}

const api = new Api();
export { api as Api };
