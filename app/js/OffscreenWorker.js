import { Browser, Graphics, Initializer, RenderLoop, WorkerToMain } from 'ohzi-core';
import { GraphicsInitializer } from './GraphicsInitializer';
import { Input } from './Input';
import { OffscreenApplication } from './OffscreenApplication';

class OffscreenWorker
{
  run()
  {
    this.canvas = undefined;
    this.application = new OffscreenApplication(this);
    this.render_loop = new RenderLoop(this.application, Graphics);

    this.handlers = {
      init: this.init.bind(this),
      start: this.start.bind(this),
      stop: this.stop.bind(this),
      dispose: this.dispose.bind(this),
      // take_screenshot: this.take_screenshot.bind(this),
      go_to_url_section: this.go_to_url_section.bind(this),
      on_resize: this.on_resize.bind(this),
      // on_frame_end: this.on_frame_end.bind(this),
      on_input_update: this.on_input_update.bind(this)
    };

    this.__bind_messages();

    // Temporary workaround for Parcel
    this.__create_fake_window();
  }

  init({ canvas, window_params, core_attributes, context_attributes, threejs_attributes, debug_mode })
  {
    this.canvas = canvas;

    Input.init();
    Browser.init(window_params.opr, window_params.chrome);
    Initializer.init(Input);

    GraphicsInitializer.init(canvas, core_attributes, context_attributes, threejs_attributes);

    this.application.init(debug_mode);
  }

  start({ pathname, search })
  {
    this.render_loop.start();

    if (this.render_loop.frames_passed === 0)
    {
      this.application.go_to_url_section(pathname, search);
    }
  }

  go_to_url_section({ pathname, search })
  {
    this.application.go_to_url_section(pathname, search);
  }

  stop()
  {
    this.render_loop.stop();
  }

  dispose()
  {
    this.application.dispose();

    Initializer.dispose();

    this.render_loop.dispose();

    Input.dispose();
  }

  // TODO: Make Graphics compatible to take screenshot on worker
  // take_screenshot()
  // {
  //   Graphics.take_screenshot((blob) => this.download_blob(blob));
  // }

  // download_blob(blob)
  // {
  //   Graphics.download_screenshot(blob);
  // }

  on_resize({ rect })
  {
    const entries = [{
      contentRect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }
    }];

    Graphics.on_resize(entries);
  }

  on_input_update({ data })
  {
    Input.update(data);
  }

  // Called from OffscreenApplication
  on_frame_end()
  {
    const data = {
      type: 'update'
    };

    if (WorkerToMain.methods.length > 0)
    {
      data.methods = WorkerToMain.methods;
      data.args = WorkerToMain.args;
    }

    // if (WorkerToMain.args.length > 0)
    // {
    //   data.args = WorkerToMain.args;
    // }

    postMessage(data);

    WorkerToMain.clear();
  }

  reload()
  {
    postMessage({ type: 'reload' });
  }

  __bind_messages()
  {
    self.addEventListener('message', (e) =>
    {
      const message = e.data;

      const handler = this.handlers[message.type];

      if (typeof handler !== 'function')
      {
        throw new Error('no handler for type: ' + message.type);
      }

      handler(message);
    });
  }

  __create_fake_window()
  {
    self.window = {
      location: {
        reload: this.reload.bind(this)
      }
    };
  }
}

new OffscreenWorker().run();
