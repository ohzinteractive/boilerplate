import { SectionsURLs } from './views/Sections';

// TODO: Rename ?
class ParamsHandler
{
  constructor()
  {
    this.debug_mode = false;

    if (process.env.NODE_ENV === 'development')
    {
      this.__setup_debug_mode();
    }
    else
    {
      localStorage.removeItem('debug_mode');
      localStorage.removeItem('skip_mode');

      this.__remove_logs();
    }

    // this.__redirect_invalid_url();
  }

  __redirect_invalid_url()
  {
    const sections_urls = Object.values(SectionsURLs);

    if (!sections_urls.includes(window.location.pathname))
    {
      window.location.replace('/');
    }
  }

  __remove_logs()
  {
    const url_params = new URLSearchParams(window.location.search);

    const logs = url_params.get('logs');

    if (!logs)
    {
      window.console.log = () =>
      {};
      window.console.warn = () =>
      {};
      window.console.error = () =>
      {};
    }
  }

  __setup_debug_mode()
  {
    let debug_mode = localStorage.getItem('debug_mode');

    this.debug_mode = debug_mode === 'true';

    if (this.debug_mode)
    {
      const sections_containers = document.querySelectorAll('.section');

      for (let i = 0; i < sections_containers.length; i++)
      {
        const section_container = sections_containers[i];

        section_container.classList.add('debug');
      }
    }

    document.addEventListener('keydown', event =>
    {
      if (event.shiftKey && event.key === 'D')
      {
        if (this.debug_mode)
        {
          debug_mode = 'false';
          document.querySelector('.lil-gui.autoPlace').style.display = 'flex';
        }
        else
        {
          debug_mode = 'true';
        }

        localStorage.setItem('debug_mode', debug_mode);
        location.reload();
      }
    });
  }
}

export { ParamsHandler };
