import { DefaultRoutingRouterState } from './router_states/DefaultRoutingRouterState';
import { RoutingByUrlRouterState } from './router_states/RoutingByUrlRouterState';

export class Router
{
  start()
  {
    this.states = {
      default: new DefaultRoutingRouterState(this),
      routing_by_url: new RoutingByUrlRouterState(this)
    };

    this.current_state = this.states.default;

    // history.pushState(null, null, '/');

    window.addEventListener('popstate', (event) =>
    {
      // Prevent back/forward navigation
      console.log('ROUTER: Preventing back/forward navigation');
      history.pushState(null, '', '/');
    });

    this.set_current_state();
  }

  set_state(state)
  {
    this.current_state.on_exit();
    this.current_state = state;
    this.current_state.on_enter();
  }

  set_current_state()
  {
    const section_name = window.location.pathname.replace('/', '');

    if (section_name)
    {
      this.set_state(this.states.routing_by_url);
    }
    else
    {
      this.set_state(this.states.default);
    }
  }
}
