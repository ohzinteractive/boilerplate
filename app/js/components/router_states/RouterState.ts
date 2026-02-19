import { ViewManager } from 'ohzi-core';
import { Sections } from '../../views/Sections';
import type { Router } from '../Router';

export class RouterState
{
  router: Router;
  
  constructor(router: Router)
  {
    this.router = router;
  }

  on_enter()
  {

  }

  on_exit()
  {

  }

  update()
  {

  }

  go_to_transition_view(next_view_name = Sections.TRANSITION)
  {
    // Wait until getting scene data to decide where to go
    const next_view = ViewManager.get(next_view_name);
    const transition_view = ViewManager.get(Sections.TRANSITION);

    // @ts-expect-error transition_view is valid
    transition_view.set_next_view(next_view);

    ViewManager.go_to_view(Sections.TRANSITION, false, false);
  }
}
