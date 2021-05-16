import * as dat from 'dat.gui';

class DatGUI
{
  constructor()
  {
    this.dat_gui = undefined;

    this.settings = {
      scale: 0.8
    };
  }

  init()
  {
    document.addEventListener('keydown', event =>
    {
      if (event.shiftKey && event.key === 'K')
      {
        document.querySelector('.dg.ac').classList.toggle('hidden');
      }
    });
  }

  start()
  {
    this.dat_gui = new dat.GUI();

    document.querySelector('.dg.ac').style['z-index'] = 999;
    document.querySelector('.dg.ac').classList.add('hidden');

    this.dat_gui.add(this.settings, 'scale', 0.1, 2);
    this.dat_gui.width = 400;
  }
}

export default new DatGUI();
