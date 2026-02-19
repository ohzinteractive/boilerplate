import { Graphics, ResourceContainer } from 'ohzi-core';

import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export class BasisInitializer
{
  init()
  {
    // Uncomment to use BASIS
    const ktx2_loader = new KTX2Loader();
    const renderer = Graphics._renderer;

    ktx2_loader.setWorkerLimit(1);
    ktx2_loader.setTranscoderPath('lib/basis/');
    ktx2_loader.detectSupport(renderer);

    ResourceContainer.set_resource('basis_loader', '/basis_loader', ktx2_loader);
  }
}
