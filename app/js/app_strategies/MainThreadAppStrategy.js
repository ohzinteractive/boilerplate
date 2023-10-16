import { WorkerToMain } from 'ohzi-core';
import { Input } from '../Input';
import { MainToWorker } from '../MainToWorker';
import { OffscreenManager } from '../OffscreenManager';
import { SharedApplication } from '../SharedApplication';
import { MainInput } from '../components/MainInput';
import { AppStrategy } from './AppStrategy';

class MainThreadAppStrategy extends AppStrategy
{
  init()
  {
    this.shared_application = new SharedApplication();

    this.shared_application.init();

    Input.init();

    // Pseudo patch to use OffscreenManager on main thread strategy
    OffscreenManager.set_api(ViewApi);

    MainToWorker.init(this.shared_application);
  }

  on_enter()
  {
    this.shared_application.set_transitions_velocity(window.location.search);

    this.shared_application.on_enter();
  }

  update()
  {
    OffscreenManager.call_methods_before_update({ methods: WorkerToMain.methods, args: WorkerToMain.args });
    WorkerToMain.clear();

    Input.update(MainInput.to_json());

    this.shared_application.update();

    Input.clear();
  }
}

export { MainThreadAppStrategy };
