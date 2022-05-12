import GUI from 'lil-gui';

class DatGUI
{
  constructor()
  {
    this.dat_gui = undefined;
    this.hidden = false;

    this.settings = {
      camera_z: 0
    };
  }

  init()
  {
    document.addEventListener('keydown', event =>
    {
      if (event.shiftKey && event.key === 'H')
      {
        if (this.hidden)
        {
          this.hidden = false;
          document.querySelector('.lil-gui.autoPlace').style.display = 'flex';
        }
        else
        {
          this.hidden = true;
          document.querySelector('.lil-gui.autoPlace').style.display = 'none';
        }
      }
    });
  }

  start()
  {
    this.dat_gui = new GUI();

    // document.querySelector('.lil-gui.autoPlace').style['z-index'] = 999;

    if (!window.debug_mode)
    {
      document.querySelector('.lil-gui.autoPlace').style.display = 'none';
    }

    this.dat_gui.add(this.settings, 'camera_z', -20, 20);
  }
}

export default new DatGUI();
