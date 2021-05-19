import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

export default class TemplateView extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template')
    });
  }

  // This method is called just one time, at the beginning of the app execution.
  start()
  {
  }

  // This method is called just one time, right after the transition to this section is finished.
  on_enter()
  {
  }

  // This method is called just after the section is completely hidden.
  on_exit()
  {
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_transition(global_view_data, transition_progress)
  {
  }
}
