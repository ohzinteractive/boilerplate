import { OffscreenManager } from '../OffscreenManager';
import { ApiStrategy } from './ApiStrategy';

class OffscreenApiStrategy extends ApiStrategy
{
  init(canvas, window_params, core_attributes, context_attributes, threejs_attributes)
  {
    console.log('Using OffscreenCanvas');
    const offscreen_canvas = canvas.transferControlToOffscreen();

    OffscreenManager.init(this.api);

    OffscreenManager.post('init', {
      canvas: offscreen_canvas,
      window_params,
      core_attributes,
      context_attributes,
      threejs_attributes,
      debug_mode: this.debug_mode
    }, [offscreen_canvas]);
  }

  start(data, application)
  {
    OffscreenManager.post('start', data);
  }

  stop()
  {
    OffscreenManager.post('stop');
  }

  dispose()
  {
    OffscreenManager.post('dispose');
  }

  // TODO: Make Graphics compatible to take screenshot on worker
  take_screenshot()
  {
    // OffscreenManager.post('take_screenshot');

    console.warn('Implement');
  }

  on_canvas_resize(entries)
  {
    OffscreenManager.on_canvas_resize(entries);
  }
}

export { OffscreenApiStrategy };
