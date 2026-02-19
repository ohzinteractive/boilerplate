import { ViewManager } from 'ohzi-core';
import { Sections } from '../../views/Sections';
import { RouterState } from './RouterState';

export class RoutingByUrlRouterState extends RouterState
{
  constructor(router)
  {
    super(router);

    this.home_view = ViewManager.get(Sections.HOME);
  }

  on_enter()
  {
    const url_params = new URLSearchParams(window.location.search);
    const logs = url_params.get('logs');

    // window.history.pushState('', '', '/');

    let next_view = undefined;

    const landing_view = ViewManager.get(Sections.HOME);

    // Allow going anywhere on development
    if (logs || import.meta.env.DEV)
    {
      next_view = ViewManager.get_by_url(window.location.pathname) || landing_view;
    }
    else
    {
      next_view = landing_view;
    }

    this.go_to_transition_view(next_view.name);
  }

  on_exit()
  {

  }

  update()
  {

  }
}
