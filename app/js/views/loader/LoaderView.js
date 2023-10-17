import { CommonView } from '../common/CommonView';

import { Sections, SectionsURLs } from '../Sections';

class LoaderView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.LOADER,
      url: SectionsURLs.LOADER,
      container: document.querySelector('.loader')
    });
  }

  start()
  {
  }

  update()
  {
  }

  set_opacity()
  {
  }
}

export { LoaderView };
