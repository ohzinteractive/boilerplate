import { ResourceContainer } from 'ohzi-core';

export default class AsyncAbstractLoader
{
  constructor(assets)
  {
    this.resource_container = ResourceContainer;
    this.assets = assets;

    this.worker = this.__setup_worker();
    this.assets_loaders = this.__setup_loaders();
  }

  load()
  {
    this.worker.postMessage({ type: 'load' });
  }

  is_loaded()
  {
    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      const asset_loader = this.assets_loaders[i];

      if (!asset_loader.has_finished)
      {
        return false;
      }
      else
      {
        if (asset_loader.has_error)
        {
          // Restore original url so the error message make more sense
          asset_loader.url = asset_loader.original_url;

          asset_loader.print_error();
        }
      }
    }

    return true;
  }

  get_assets_names()
  {
    const names = [];

    for (let i = 0; i < this.assets.length; i++)
    {
      const asset = this.assets[i];

      names.push(asset.name);
    }

    return names;
  }

  __setup_worker()
  {
    const worker = new Worker(
      new URL('./assets_loader/AsyncAssetsLoaderWorker.js', import.meta.url),
      { name: 'OHZI - AssetLoader', type: 'module' });

    worker.addEventListener('message', (e) =>
    {
      const message = e.data;

      switch (message.type)
      {
      case 'asset_loaded':
        this.__on_assets_loaded(message.data);
        break;
      }
    });

    worker.postMessage({ type: 'assets', data: this.assets });

    return worker;
  }

  __on_assets_loaded(resources)
  {
    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      const asset_loader = this.assets_loaders[i];

      // Save original url to show in a possible error
      asset_loader.original_url = asset_loader.url;

      asset_loader.url = resources[asset_loader.resource_id];

      asset_loader.on_preloaded_finished(this.resource_container);
    }
  }

  __setup_loaders()
  {
    console.warn('Not implemented');
  }
}
