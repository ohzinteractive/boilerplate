import { OffscreenManager } from '../OffscreenManager';
import { MainInput } from '../components/MainInput';
import { AppStrategy } from './AppStrategy';

class OffScreenAppStrategy extends AppStrategy
{
  init()
  {

  }

  on_enter()
  {
    OffscreenManager.post('set_transitions_velocity', { search: window.location.search });
  }

  update()
  {
    OffscreenManager.post('on_input_update', { data: MainInput.to_json() });

    this.app.on_frame_end();
  }
}

export { OffScreenAppStrategy };
