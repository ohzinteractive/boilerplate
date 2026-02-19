class Initializer
{
  async init()
  {
    console.log(atob('RGVzaWduZWQgJiBEZXZlbG9wZWQgYnkgT0haSSBJbnRlcmFjdGl2ZSAvIGh0dHBzOi8vb2h6aS5pbw=='));

    const api = await import('./Api');
    api.Api.init();
  }
}

const initializer = new Initializer();
initializer.init();
