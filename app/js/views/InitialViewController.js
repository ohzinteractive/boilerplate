import { ApplicationViewController } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

class InitialViewController extends ApplicationViewController
{
  constructor()
  {
    super({
      name: Sections.INITIAL,
      url: SectionsURLs.INITIAL
    });
  }
}

export { InitialViewController };
