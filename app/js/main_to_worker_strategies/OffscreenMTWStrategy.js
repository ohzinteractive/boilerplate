import { MTWStrategy } from './MTWStrategy';

class OffscreenMTWStrategy extends MTWStrategy
{
  post(method, args)
  {
    this.offscreen_manager.post(method, args);
  }
}

export { OffscreenMTWStrategy };
