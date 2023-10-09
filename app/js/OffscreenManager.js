
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

  post(type, data = {}, reference_data = [])
  {
    data.type = type;

    this.worker.postMessage(data, reference_data);
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

  call_methods_before_update(message)
  {
    message.methods = message.methods || [];
    message.args = message.args || [];

    for (let i = 0; i < message.methods.length; i++)
    {
      const method_string = message.methods[i];

      const method_path = method_string.split('.');
      let current_parent = this.api.application[method_path[0]];
      let current_method = this.api.application[method_path[0]];

      // Go deep until find owner method
      for (let j = 1; j < method_path.length - 1; j++)
      {
        const parent = method_path[j];

        current_parent = current_method[parent];
      }

      // Go deep until find method to call
      for (let j = 1; j < method_path.length; j++)
      {
        const method = method_path[j];

        current_method = current_method[method];
      }

      const method_to_call = current_method.bind(current_parent);

      method_to_call(...message.args[i]);
    }
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

const request_manager = new OffscreenManager();
export { request_manager as OffscreenManager };
