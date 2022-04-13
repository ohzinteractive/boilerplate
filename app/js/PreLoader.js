
export default class PreLoader
{
  async init()
  {
    document.querySelector('.loader').classList.remove('hidden');

    const api = await import('./Api');

    api.Api.init();
  }
}

const pre_loader = new PreLoader();
export { pre_loader as PreLoader };
