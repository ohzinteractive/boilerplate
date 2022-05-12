import { AsyncTextureLoader, BasisLoader, ResourceContainer } from 'ohzi-core';

import AsyncAbstractLoader from './AsyncAbstractLoader';

export default class AsyncTexturesLoader extends AsyncAbstractLoader
{
  constructor(assets)
  {
    super(assets);
  }

  // Called from parent
  __setup_loaders()
  {
    const loaders = [];

    for (let i = 0; i < this.assets.length; i++)
    {
      const asset_data = this.assets[i];

      if (asset_data.basis)
      {
        const basis_loader = ResourceContainer.get('basis_loader');

        loaders.push(new BasisLoader(asset_data.name, asset_data.url, basis_loader, asset_data.size));
      }
      else
      {
        loaders.push(new AsyncTextureLoader(asset_data.name, asset_data.url, asset_data.size));
      }
    }

    return loaders;
  }
}
