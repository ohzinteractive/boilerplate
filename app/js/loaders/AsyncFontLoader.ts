import { AsyncAbstractLoader, FontLoader } from 'ohzi-core';

// Loads typeface JSON fonts (three's FontLoader format) through the scene asset pipeline.
// Pass it to set_assets() as a custom loader, with FontsCompilator as its compilator.
export class AsyncFontLoader extends AsyncAbstractLoader
{
  constructor(scene_name: string, assets: any[], worker: Worker)
  {
    super(scene_name, assets, worker);
  }

  // Called from parent
  __setup_loaders()
  {
    const loaders = [];

    for (let i = 0; i < this.assets.length; i++)
    {
      const asset_data = this.assets[i] as { name: string; url: string; size: number };

      loaders.push(new FontLoader(asset_data.name, asset_data.url, asset_data.size));
    }

    return loaders;
  }
}
