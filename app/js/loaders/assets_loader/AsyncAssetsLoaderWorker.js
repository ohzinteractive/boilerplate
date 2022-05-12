import ResourceBatch from './ResourceBatch';
import ResourceContainer from './ResourceContainer';
import AssetLoader from './AssetLoader';

// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

class AsyncAssetsLoaderWorker
{
  run()
  {
    this.assets = [];
    // We use custom ResourceBatch, ResourceContainer and AbstractLoader to reduce build size
    this.batch = new ResourceBatch();

    ResourceContainer.init();

    this.__bind_messages();
  }

  __bind_messages()
  {
    self.addEventListener('message', (e) =>
    {
      const message = e.data;

      switch (message.type)
      {
      case 'loader':
        this.loader = message.data;
        break;
      case 'assets':
        this.assets = this.assets.concat(message.data);
        break;
      case 'load':
        this.__setup_batch();
        this.batch.load(ResourceContainer);
        this.check_resource_loading(this.batch, this.on_assets_ready.bind(this), 10);
        break;
      }
    });
  }

  on_assets_ready()
  {
    postMessage({ type: 'asset_loaded', data: ResourceContainer.resources });
  }

  check_resource_loading(batch, on_resources_loaded, timeout)
  {
    if (batch.loading_finished)
    {
      if (batch.has_errors)
      {
        batch.print_errors();
      }
      else
      {
        on_resources_loaded();
      }
    }
    else
    {
      setTimeout(function()
      {
        this.check_resource_loading(batch, on_resources_loaded);
      }.bind(this), timeout);
    }
  }

  __setup_batch()
  {
    for (let i = 0; i < this.assets.length; i++)
    {
      const asset = this.assets[i];

      this.batch.add_loader(new AssetLoader(asset.name, asset.url, asset.size));
    }
  }
}

new AsyncAssetsLoaderWorker().run();
