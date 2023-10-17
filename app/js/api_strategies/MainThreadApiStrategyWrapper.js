import { ApiStrategy } from './ApiStrategy';

class MainThreadApiStrategyWrapper extends ApiStrategy
{
  async init(payload)
  {
    const strategy_file = await import('./MainThreadApiStrategy');
    this.strategy = new strategy_file.MainThreadApiStrategy();

    this.strategy.init(payload);
  }

  start()
  {
    this.strategy.start();
  }

  stop()
  {
    this.strategy.stop();
  }

  dispose()
  {
    this.strategy.dispose();
  }

  take_screenshot(callback = (blob) => this.download_blob(blob))
  {
    this.strategy.take_screenshot(callback);
  }

  download_blob(blob)
  {
    this.strategy.download_blob(blob);
  }

  on_canvas_resize(entries)
  {
    this.strategy.on_canvas_resize(entries);
  }
}

export { MainThreadApiStrategyWrapper };
