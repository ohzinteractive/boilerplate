import { BaseApplication, WorkerToMain } from 'ohzi-core';

import { SharedApplication } from './SharedApplication';

class OffscreenApplication extends BaseApplication
{
  constructor(worker)
  {
    super();

    this.worker = worker;

    this.handlers = {
      set_next_view_controller_name: this.set_next_view_controller_name.bind(this),
      go_to_view_controller: this.go_to_view_controller.bind(this),
      set_transitions_velocity: this.set_transitions_velocity.bind(this)
    };
  }

  init()
  {
    this.shared_application = new SharedApplication();

    this.shared_application.init();
  }

  on_enter()
  {
    this.shared_application.on_enter();

    WorkerToMain.push('on_enter');
  }

  update()
  {
    this.shared_application.update();
  }

  handle_message(message)
  {
    const handler = this.handlers[message.type];

    if (typeof handler !== 'function')
    {
      throw new Error('no handler for type: ' + message.type);
    }

    handler(message);
  }

  set_next_view_controller_name(data)
  {
    this.shared_application.set_next_view_controller_name(data);
  }

  set_transitions_velocity(data)
  {
    this.shared_application.set_transitions_velocity(data);
  }

  go_to_view_controller(data)
  {
    this.shared_application.go_to_view_controller(data);
  }

  on_frame_end()
  {
    this.worker.on_frame_end();
  }
}

export { OffscreenApplication };
