import { Input } from '../Input';
import { MainInput } from '../components/MainInput';
import { MainAppStrategy } from './MainAppStrategy';

class MainThreadMainAppStrategy extends MainAppStrategy
{
  init()
  {
    this.app.shared_application.init();

    Input.init();
  }

  on_enter()
  {
    this.app.shared_application.on_enter();
  }

  go_to_url_section({ pathname, search })
  {
    this.app.shared_application.go_to_url_section(pathname, search);
  }

  go_to(section, change_url, skip)
  {
    this.app.shared_application.go_to(section, change_url, skip);
  }

  go_to_scene(view_name)
  {
    this.app.shared_application.go_to_scene(view_name);
  }

  update()
  {
    Input.update(MainInput.to_json());

    this.app.shared_application.update();

    Input.clear();
  }
}

export { MainThreadMainAppStrategy };
