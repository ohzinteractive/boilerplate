import { AppStrategy } from './AppStrategy';

class MainThreadAppStrategyWrapper extends AppStrategy
{
  async init()
  {
    const strategy_file = await import('./MainThreadAppStrategy');
    this.strategy = new strategy_file.MainThreadAppStrategy();

    this.strategy.init();
  }

  on_enter()
  {
    this.strategy.on_enter();
  }

  update()
  {
    this.strategy.update();
  }
}

export { MainThreadAppStrategyWrapper };
