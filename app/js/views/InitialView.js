import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

export default class InitialView extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.INITIAL,
      url: SectionsURLs.INITIAL,
      container: undefined
    });
  }

  show()
  {}

  on_enter()
  {}

  on_exit()
  {}

  hide()
  {}

  update(global_view_data)
  {
  }
}
