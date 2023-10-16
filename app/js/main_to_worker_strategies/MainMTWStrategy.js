import { MTWStrategy } from './MTWStrategy';

class MainMTWStrategy extends MTWStrategy
{
  constructor(app)
  {
    super();

    this.app = app;
  }

  post(method, args)
  {
    this.app[method](args);
  }
}

export { MainMTWStrategy };
