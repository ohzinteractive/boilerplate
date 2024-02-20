import { OffscreenManager } from './OffscreenManager';
import { Settings } from './Settings';
import { MainMTWStrategy } from './main_to_worker_strategies/MainMTWStrategy';
import { OffscreenMTWStrategy } from './main_to_worker_strategies/OffscreenMTWStrategy';

class MainToWorker
{
  init(main_app)
  {
    this.strategies = {
      main_thread: new MainMTWStrategy(main_app),
      offscreen: new OffscreenMTWStrategy(OffscreenManager)
    };

    this.current_strategy = Settings.use_offscreen_canvas ? this.strategies.offscreen : this.strategies.main_thread;
  }

  // Method to call funtions on SharedApplication (or MainApplication if offscreen canvas is not used)
  push(method, args)
  {
    this.current_strategy.post(method, { args });
  }
}

const main_to_worker = new MainToWorker();
export { main_to_worker as MainToWorker };
