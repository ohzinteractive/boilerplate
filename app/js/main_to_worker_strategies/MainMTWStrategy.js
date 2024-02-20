import { Bifrost } from '../Bifrost';
import { MTWStrategy } from './MTWStrategy';

class MainMTWStrategy extends MTWStrategy
{
  constructor(app)
  {
    super();

    this.app = app;
  }

  post(method, { args })
  {
    Bifrost.run(this.app, method, args);
  }
}

export { MainMTWStrategy };
