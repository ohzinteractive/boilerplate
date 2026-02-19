import { ViewManager } from 'ohzi-core';
import { Sections } from '../../views/Sections';
import type { Router } from '../Router';
import { RouterState } from './RouterState';

export class DefaultRoutingRouterState extends RouterState
{
  constructor(router: Router)
  {
    super(router);
  }

  on_enter()
  {
    const landing_view = ViewManager.get(Sections.HOME);

    this.go_to_transition_view(landing_view.name);
  }

  on_exit()
  {

  }

  update()
  {

  }
}
