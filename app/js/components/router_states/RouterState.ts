import { ViewManager } from 'ohzi-core';
import { Sections } from '../../views/Sections';

export class RouterState
{
  constructor(router)
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
    ViewManager.get(Sections.TRANSITION).set_next_view(next_view);

    ViewManager.go_to_view(Sections.TRANSITION, false, false);
  }
}
