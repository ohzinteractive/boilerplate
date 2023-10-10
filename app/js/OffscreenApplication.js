import { BaseApplication, WorkerToMain } from 'ohzi-core';

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

  go_to_url_section(pathname, search)
  {
    this.shared_application.go_to_url_section(pathname, search);
  }

  go_to(section, change_url = true, skip = false)
  {
    this.shared_application.go_to(section, change_url, skip);
  }

  go_to_scene(view_name)
  {
    this.shared_application.go_to_scene(view_name);
  }

  on_frame_end()
  {
    this.worker.on_frame_end();
  }
}

export { OffscreenApplication };
