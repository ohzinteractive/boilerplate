import { AudioLoader } from 'ohzi-core';
import AsyncAbstractLoader from './AsyncAbstractLoader';

export default class AsyncAudiosLoader extends AsyncAbstractLoader
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

      loaders.push(new AudioLoader(
        asset_data.name,
        asset_data.url,
        asset_data.loop,
        asset_data.volume,
        asset_data.size,
        asset_data.positional
      ));
    }

    return loaders;
  }
}
