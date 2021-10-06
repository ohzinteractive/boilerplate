import { ApplicationView } from 'ohzi-core';

import { Sections, SectionsURLs } from './Sections';

// For Rama, by Rama. No eliminar >:(
export default class TestingView extends ApplicationView
{
  constructor()
  {
    super({
      name: 'testing',
      url: 'testing',
      container: document.body
    });
  }
}
