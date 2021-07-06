import { ResourceBatch } from 'ohzi-core';
// import { Graphics } from 'ohzi-core';

// import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

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
    this.batch.add_text('home_data', 'data/home.xml', 40027);
  }

  load()
  {
    this.batch.load(this.resource_container);
  }
}
