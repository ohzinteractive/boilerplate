import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

export class InitialView extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.INITIAL,
      url: SectionsURLs.INITIAL,
      // @ts-expect-error Setting mock element
      container: { style: {} }
    });
  }

  start()
  {
  }

  before_enter()
  {
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
  }

  update_enter_transition(global_view_data: any, transition_progress: any, action_sequencer: any)
  {
  }

  update_exit_transition(global_view_data: any, transition_progress: any, action_sequencer: any)
  {
  }
}
