import { ResourceContainer } from 'ohzi-core';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class DracoInitializer
{
  init()
  {
    const draco_loader = new DRACOLoader();
    draco_loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    draco_loader.setDecoderConfig({ type: 'js' });
    draco_loader.setWorkerLimit(1);

    ResourceContainer.set_resource('draco_loader', '/draco_loader', draco_loader);
  }
}
