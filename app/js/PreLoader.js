import { PreLandingView } from './views/pre_landing/PreLandingView';

class PreLoader
{
  async init()
  {
    document.querySelector('.loader__group').classList.remove('hidden');

    console.log(atob('RGVzaWduZWQgJiBEZXZlbG9wZWQgYnkgT0haSSBJbnRlcmFjdGl2ZSAvIGh0dHBzOi8vb2h6aS5pbw=='));

    // This constant depends on the project.
    // If a project needs to show a landing before app is loaded, this should be true.
    const use_pre_landing = false;

    if (use_pre_landing)
    {
      const pre_landing = new PreLandingView();
      pre_landing.start();
    }
    else
    {
      document.querySelector('.pre-landing').classList.add('hidden');
    }

    const api = await import('./Api');
    api.Api.init();
  }
}

const pre_loader = new PreLoader();
export { pre_loader as PreLoader };
