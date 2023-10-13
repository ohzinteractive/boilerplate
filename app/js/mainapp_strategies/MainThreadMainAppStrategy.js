import { Input } from '../Input';
import { SharedApplication } from '../SharedApplication';
import { MainInput } from '../components/MainInput';
import { MainAppStrategy } from './MainAppStrategy';

class MainThreadMainAppStrategy extends MainAppStrategy
{
  init()
  {
    this.shared_application = new SharedApplication(this.app);

    this.shared_application.init();

    Input.init();
  }

  on_enter()
  {
    this.shared_application.on_enter();
    this.shared_application.set_transitions_velocity(window.location.search);
  }

  update()
  {
    Input.update(MainInput.to_json());

    this.shared_application.update();

    Input.clear();
  }
}

export { MainThreadMainAppStrategy };
