import { Graphics, Initializer, RenderLoop } from 'ohzi-core';
import { GraphicsInitializer } from '../GraphicsInitializer';
import { MainInput } from '../components/MainInput';
import { ApiStrategy } from './ApiStrategy';

class MainThreadApiStrategy extends ApiStrategy
{
  init(canvas, window_params, core_attributes, context_attributes, threejs_attributes, application)
  {
    console.log('Using Main Thread');
    Initializer.init(MainInput);
    GraphicsInitializer.init(canvas, core_attributes, context_attributes, threejs_attributes);

    this.application = application;
    this.render_loop = new RenderLoop(application, Graphics);
  }

  start({ pathname, search })
  {
    this.render_loop.start();

    if (this.render_loop.frames_passed === 0)
    {
      this.application.go_to_url_section(pathname, search);
    }
  }

  stop()
  {
    this.render_loop.stop();
  }

  dispose()
  {
    Initializer.dispose();

    this.render_loop.dispose();

    // MainInput.dispose();
  }

  take_screenshot(callback = (blob) => this.download_blob(blob))
  {
    Graphics.take_screenshot(callback);
  }

  download_blob(blob)
  {
    Graphics.download_screenshot(blob);
  }

  on_canvas_resize(entries)
  {
    Graphics.on_resize(entries);
  }
}

export { MainThreadApiStrategy };
