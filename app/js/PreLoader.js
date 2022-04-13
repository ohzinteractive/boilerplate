
export default class PreLoader
{
  async init()
  {
    document.querySelector('.loader').classList.remove('hidden');
    console.log(atob('RGVzaWduZWQgJiBEZXZlbG9wZWQgYnkgT0haSSBJbnRlcmFjdGl2ZSAvIGh0dHBzOi8vb2h6aS5pbw=='));

    const api = await import('./Api');

    api.Api.init();
  }
}

const pre_loader = new PreLoader();
export { pre_loader as PreLoader };
