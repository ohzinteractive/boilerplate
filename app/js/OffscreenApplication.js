import { BaseApplication, ViewControllerManager, WorkerToMain } from 'ohzi-core';

import { SharedApplication } from './SharedApplication';

class OffscreenApplication extends BaseApplication
{
  constructor(worker)
  {
    super();

    this.worker = worker;
  }

  init(debug_mode)
  {
    this.debug_mode = debug_mode;
    this.shared_application = new SharedApplication(this);

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

  set_next_view_controller_name(next_view_controller_name)
  {
    ViewControllerManager.get('transition').set_next_view_controller_name(next_view_controller_name);
  }

  set_transitions_velocity(transitions_velocity)
  {
    this.shared_application.set_transitions_velocity(transitions_velocity);
  }

  go_to_view_controller(view_controller_name, skip)
  {
    ViewControllerManager.go_to_view_controller(view_controller_name, skip);
  }

  on_frame_end()
  {
    this.worker.on_frame_end();
  }
}

export { OffscreenApplication };
