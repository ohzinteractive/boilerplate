import { MTWStrategy } from './MTWStrategy';

class MainMTWStrategy extends MTWStrategy
{
  post(method, args)
  {
    this.app[method](args);
  }
}

export { MainMTWStrategy };
