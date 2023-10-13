import { OffscreenManager } from './OffscreenManager';
import { MainMTWStrategy } from './main_to_worker_strategies/MainMTWStrategy';
import { OffscreenMTWStrategy } from './main_to_worker_strategies/OffscreenMTWStrategy';

class MainToWorker
{
  init(main_app, use_offscreen_canvas)
  {
    this.strategies = {
      main_thread: new MainMTWStrategy(main_app, OffscreenManager),
      offscreen: new OffscreenMTWStrategy(main_app, OffscreenManager)
    };

    this.current_strategy = use_offscreen_canvas ? this.strategies.offscreen : this.strategies.main_thread;
  }

  post(method, args)
  {
    this.current_strategy.post(method, args);
  }
}

const main_to_worker = new MainToWorker();
export { main_to_worker as MainToWorker };
