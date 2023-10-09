import { ResourceBatch, ResourceContainer } from 'ohzi-core';

// import { Graphics } from 'ohzi-core';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class GeneralLoader
{
  constructor()
  {
    this.batch = new ResourceBatch('general_loader', ResourceContainer);

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

    // ResourceContainer.set_resource('basis_loader', '/basis_loader', basis_loader);

    // Uncomment to use DRACO
    // const draco_loader = new DRACOLoader();
    // draco_loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
    // draco_loader.setDecoderConfig({ type: 'js' });
    // draco_loader.setWorkerLimit(1);

    // ResourceContainer.set_resource('draco_loader', '/draco_loader', draco_loader);

    // Uncomment if needed to load assets asynchronously
    // const assets_worker = AsyncAbstractLoader.create_worker();
    // ResourceContainer.set_resource('assets_worker', '/assets_worker', assets_worker);
  }

  load()
  {
    this.batch.load();
  }
}

export { GeneralLoader };
