import { OffscreenManager } from '../OffscreenManager';
import { MainInput } from '../components/MainInput';
import { MainAppStrategy } from './MainAppStrategy';

class OffScreenMainAppStrategy extends MainAppStrategy
{
  init()
  {

  }

  on_enter()
  {

  }

  go_to_url_section(data)
  {
    OffscreenManager.post('go_to_url_section', data);
  }

  go_to(section, change_url, skip)
  {
    OffscreenManager.post('go_to', { section, change_url, skip });
  }

  go_to_scene(view_name)
  {
    OffscreenManager.post('go_to_scene', { view_name });
  }

  update()
  {
    OffscreenManager.post('on_input_update', { data: MainInput.to_json() });

    this.app.on_frame_end();
  }
}

export { OffScreenMainAppStrategy };
