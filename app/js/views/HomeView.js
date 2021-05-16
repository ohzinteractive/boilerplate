import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

export default class HomeView extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.HOME,
      url: SectionsURLs.HOME,
      container: document.querySelector('.home')
    });
  }

  start()
  {
  }

  update()
  {
  }
}
