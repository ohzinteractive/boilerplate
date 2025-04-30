import { Graphics, Initializer, RenderLoop } from 'ohzi-core';

// import { Debug } from 'ohzi-core';
// import { ResourceContainer } from 'ohzi-core';

import package_json from '../../package.json';

// APP
import { Input } from './components/Input';
// import { BasisInitializer } from './initializers/BasisInitializer';
// import { DracoInitializer } from './initializers/DracoInitializer';
import { DebugModeController } from './components/DebugModeController';
import { GraphicsInitializer } from './initializers/GraphicsInitializer';
import { MainApplication } from './MainApplication';
import { Preloader } from './Preloader';
import { Settings } from './Settings';

class Api
{
  init()
  {
    this.debug_mode_controller = new DebugModeController();
    Settings.debug_mode = this.debug_mode_controller.debug_mode;

    this.application = new MainApplication();

    this.preloader = new Preloader(this);

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

    this.preloader.init();

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

  record_video(seconds = 5, fps = 60, format = 'video/mp4', callback = (blob) => this.download_video(blob, format))
  {
    // Assuming you already have a WebGL canvas
    const canvas = document.querySelector('canvas');
    const stream = canvas.captureStream(fps);

    // Create MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: format // or 'video/webm; codecs=vp9' if supported
    });

    const chunks = [];

    mediaRecorder.ondataavailable = (event) =>
    {
      if (event.data.size > 0)
      {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () =>
    {
      const blob = new Blob(chunks, { type: format });
      callback(blob, format);
    };

    // Start recording
    mediaRecorder.start();

    // Stop after 5 seconds for example
    setTimeout(() =>
    {
      mediaRecorder.stop();
    }, seconds * 1000);
  }

  download_video(blob, format = 'video/mp4')
  {
    console.log(format);
    const url = URL.createObjectURL(blob);

    const extension = format.split('/')[1]; // Get the file extension from the MIME type
    const hours = String(new Date().getHours()).padStart(2, '0');
    const minutes = String(new Date().getMinutes()).padStart(2, '0');
    const seconds = String(new Date().getSeconds()).padStart(2, '0');

    const filename = `recording_${hours}_${minutes}_${seconds}.${extension}`;

    // Download or use the video
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
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
