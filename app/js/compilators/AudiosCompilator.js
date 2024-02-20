// import { AudioManager } from 'ohzi-components';

class AudiosCompilator
{
  constructor(sounds_data)
  {
    this.finished = false;

    this.sounds_data = sounds_data;
  }

  start()
  {
    // AudioManager.init_sounds(this.sounds_data);
  }

  update()
  {
    this.finished = true;
  }
}

export { AudiosCompilator };
