import { MTWStrategy } from './MTWStrategy';

class OffscreenMTWStrategy extends MTWStrategy
{
  constructor(offscreen_manager)
  {
    super();

    this.offscreen_manager = offscreen_manager;
  }

  post(method, args)
  {
    this.offscreen_manager.post(method, args);
  }
}

export { OffscreenMTWStrategy };
