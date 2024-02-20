import { Bifrost } from './Bifrost';

class OffscreenManager
{
  constructor()
  {
    this.worker = undefined;
  }

  init(api)
  {
    this.api = api;

    this.handlers = {
      update: this.on_update.bind(this),
      reload: this.on_reload.bind(this)
    };

    this.worker = this.__create_worker();
    this.__setup_worker();
  }

  post(type, data = {}, transferable_data = [])
  {
    data.type = type;

    this.worker.postMessage(data, transferable_data);
  }

  on_canvas_resize(entries)
  {
    const rect = {};

    for (const entry of entries)
    {
      rect.x = entry.contentRect.x;
      rect.y = entry.contentRect.y;
      rect.width = entry.contentRect.width;
      rect.height = entry.contentRect.height;
    }

    this.worker.postMessage({
      type: 'on_resize',
      rect: rect
    });
  }

  on_update(message)
  {
    this.call_methods_before_update(message);

    this.api.update();
  }

  on_reload()
  {
    location.reload();
  }

  call_methods_before_update({ methods, args })
  {
    methods = methods || [];
    args = args || [];

    for (let i = 0; i < methods.length; i++)
    {
      Bifrost.run(this.api.application, methods[i], args[i]);
    }
  }

  // Should be used only by MainThreadAppStrategy
  set_api(api)
  {
    this.api = api;
  }

  // From Worker to Main
  on_message(e)
  {
    const message = e.data;

    const handler = this.handlers[message.type];

    if (typeof handler !== 'function')
    {
      throw new Error('no handler for type: ' + message.type);
    }

    handler(message);
  }

  __create_worker()
  {
    const worker = new Worker(
      new URL('./OffscreenWorker.js', import.meta.url),
      { name: 'OHZI - OffscreenCanvas', type: 'module' });

    return worker;
  }

  __setup_worker()
  {
    this.worker.addEventListener('message', this.on_message.bind(this));
  }
}

const offscreen_manager = new OffscreenManager();
export { offscreen_manager as OffscreenManager };
