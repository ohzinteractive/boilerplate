import GUI from 'lil-gui';
import { Settings } from '../Settings';

class DatGUI
{
  constructor()
  {
    this.dat_gui = undefined;
    this.hidden = false;
    this.debug_mode = false;
  }

  init(debug_mode)
  {
    this.debug_mode = debug_mode;

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

    if (!this.debug_mode)
    {
      document.querySelector('.lil-gui.autoPlace').style.display = 'none';
    }

    this.dat_gui.add(Settings.general, 'value', -20, 20);
  }
}

const dat = new DatGUI();
export { dat as DatGUI };
