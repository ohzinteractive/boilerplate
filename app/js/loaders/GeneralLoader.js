import { ResourceContainer, ResourceBatch } from 'ohzi-core';
// import { Graphics } from 'ohzi-core';

// import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

import home_data from 'bundle-text:../../assets/data/home.xml';

export default class GeneralLoader
{
  constructor(resource_container)
  {
    this.batch = new ResourceBatch();
    this.resource_container = resource_container;

    this.__setup_batch();
  }

  __setup_batch()
  {
    // let basis_loader = new BasisTextureLoader();
    // const renderer = Graphics._renderer;

    // PNG
    // this.batch.add_texture('emoji_atlas', 'textures/emojis/emojis.png', 100000);

    // BASIS
    // this.batch.add_basis('emoji_atlas', 'textures/emojis/emojis.basis', renderer, basis_loader, 100000);

    // __SECTIONS_DATA__

    ResourceContainer.set_resource('home_data', 'data/home.xml', home_data);
  }

  load()
  {
    this.batch.load(this.resource_container);
  }
}
