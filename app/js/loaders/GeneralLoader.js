import { ResourceContainer } from 'ohzi-core';
import { ResourceBatch } from 'ohzi-core';

// import { Graphics } from 'ohzi-core';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

import home_data from '../../data/transitions/home.json';

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
    // const basis_loader = new KTX2Loader();
    // const renderer = Graphics._renderer;

    // basis_loader.setWorkerLimit(1);
    // basis_loader.setTranscoderPath('libs/basis/');
    // basis_loader.detectSupport(renderer);

    // this.resource_container.set_resource('basis_loader', '/basis_loader', basis_loader);

    // window.draco_decoder_path = 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/';

    // __SECTIONS_DATA__
    ResourceContainer.set_resource('home_data', 'data/home.json', home_data);
  }

  load()
  {
    this.batch.load(this.resource_container);
  }
}
