import { BaseApplication, Time, WorkerToMain } from 'ohzi-core';

import { SharedApplication } from './SharedApplication';

class OffscreenApplication extends BaseApplication
{
  constructor(worker)
  {
    super();

    this.worker = worker;
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

    WorkerToMain.push('time.update', [Time.to_json()]);
  }

  on_frame_end()
  {
    this.worker.on_frame_end();
  }
}

export { OffscreenApplication };
