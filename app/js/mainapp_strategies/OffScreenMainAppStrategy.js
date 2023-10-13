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
    OffscreenManager.post('set_transitions_velocity', { search: window.location.search });
  }

  update()
  {
    OffscreenManager.post('on_input_update', { data: MainInput.to_json() });

    this.app.on_frame_end();
  }
}

export { OffScreenMainAppStrategy };
