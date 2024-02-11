import { Graphics, ResourceContainer } from 'ohzi-core';

import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export class BASISInitializer
{
  init(canvas, core_attributes, context_attributes, threejs_attributes)
  {
  // Uncomment to use BASIS
    const basis_loader = new KTX2Loader();
    const renderer = Graphics._renderer;

    basis_loader.setWorkerLimit(1);
    basis_loader.setTranscoderPath('libs/basis/');
    basis_loader.detectSupport(renderer);

    ResourceContainer.set_resource('basis_loader', '/basis_loader', basis_loader);
  }
}
