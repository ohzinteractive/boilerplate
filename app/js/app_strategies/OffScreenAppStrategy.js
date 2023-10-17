import { MainToWorker } from '../MainToWorker';
import { OffscreenManager } from '../OffscreenManager';
import { Settings } from '../Settings';
import { MainInput } from '../components/MainInput';
import { AppStrategy } from './AppStrategy';

class OffScreenAppStrategy extends AppStrategy
{
  constructor(app)
  {
    super();

    this.app = app;
  }

  init()
  {
    OffscreenManager.post('on_settings_update', { data: Settings.to_json() });

    MainToWorker.init();
  }

  on_enter()
  {
    OffscreenManager.post('set_transitions_velocity', { search: window.location.search });
  }

  update()
  {
    if (MainInput.needs_update)
    {
      OffscreenManager.post('on_input_update', { data: MainInput.to_json() });
    }

    if (Settings.needs_update)
    {
      OffscreenManager.post('on_settings_update', { data: Settings.to_json() });
      Settings.clear();
    }

    this.app.on_frame_end();
  }
}

export { OffScreenAppStrategy };
