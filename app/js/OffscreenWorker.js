import { Graphics, Initializer, RenderLoop, WorkerToMain } from 'ohzi-core';
import { GraphicsInitializer } from './GraphicsInitializer';
import { OffScreenInput } from './OffScreenInput';
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

    Initializer.init(OffScreenInput, window_params);

    GraphicsInitializer.init(canvas, core_attributes, context_attributes, threejs_attributes);

    this.application.init(debug_mode);
  }

  start({ pathname, search })
  {
    this.render_loop.start();

    this.application.go_to_url_section(pathname, search);
  }

  go_to_url_section({ pathname, search })
  {
    this.application.go_to_url_section(pathname, search);
  }

  stop()
  {
    this.render_loop.stop();
  }

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
    OffScreenInput.update(data);
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
