import { AsyncAbstractLoader, ResourceBatch, ResourceContainer } from 'ohzi-core';

export class GeneralLoader
{
  batch: ResourceBatch;

  constructor()
  {
    this.batch = new ResourceBatch('general_loader');

    this.__setup_batch();

    const assets_worker = AsyncAbstractLoader.create_worker();
    ResourceContainer.set_resource('assets_worker', '/assets_worker', assets_worker);
  }

  __setup_batch()
  {

  }

  load()
  {
    this.batch.load();
  }
}
