import { ResourceContainer } from 'ohzi-core';
import { ResourceBatch } from 'ohzi-core';

// import { Graphics } from 'ohzi-core';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/KTX2Loader.js';

import home_data from '../../data/transitions/home.json';
import transition_data from '../../data/transitions/transition.json';
import test_general_data from '../../data/transitions/test_general.json';
import AsyncAbstractLoader from './AsyncAbstractLoader';

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
    // Uncomment to use BASIS
    // const basis_loader = new KTX2Loader();
    // const renderer = Graphics._renderer;

    // basis_loader.setWorkerLimit(1);
    // basis_loader.setTranscoderPath('libs/basis/');
    // basis_loader.detectSupport(renderer);

    // this.resource_container.set_resource('basis_loader', '/basis_loader', basis_loader);

    // Uncomment to use DRACO
    // const draco_loader = new DRACOLoader();
    // draco_loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
    // draco_loader.setDecoderConfig({ type: 'js' });
    // draco_loader.setWorkerLimit(1);

    // this.resource_container.set_resource('draco_loader', '/draco_loader', draco_loader);

    const assets_worker = AsyncAbstractLoader.create_worker();
    this.resource_container.set_resource('assets_worker', '/assets_worker', assets_worker);

    // __SECTIONS_DATA__
    ResourceContainer.set_resource('transition_data', 'data/transition.json', transition_data);
    ResourceContainer.set_resource('test_general_data', 'data/test_general.json', test_general_data);
    ResourceContainer.set_resource('home_data', 'data/home.json', home_data);
  }

  load()
  {
    this.batch.load(this.resource_container);
  }
}
