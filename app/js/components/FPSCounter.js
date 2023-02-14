import { Time } from 'ohzi-core';

class FPSCounter
{
  constructor()
  {
    this.last_loop = undefined;
    this.count = 1;
    this.total = 1;
    this.fps = 60;

    this.fps_samples = [60, 60, 60, 60, 60];
  }

  update()
  {
    this.count_fps();
  }

  count_fps()
  {
    this.last_loop = this.last_loop ? this.last_loop : Math.floor(Time.elapsed_time);
    const current_loop = Math.floor(Time.elapsed_time);

    if (this.last_loop < current_loop)
    {
      this.fps = this.count;
      this.count = 1;
      this.last_loop = current_loop;

      this.fps_samples.shift();
      this.fps_samples.push(this.fps);
    }
    else
    {
      this.count += 1;
      this.total += 1;
    }
  }

  get avg()
  {
    let fpss = 0;

    for (let i = 0; i < this.fps_samples.length; i++)
    {
      fpss += this.fps_samples[i];
    }

    return fpss / this.fps_samples.length;
  }
}

const fps_counter = new FPSCounter();
export { fps_counter as FPSCounter };
