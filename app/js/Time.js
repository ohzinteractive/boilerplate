// Formerly SharedTime
class Time
{
  constructor()
  {
  }

  init()
  {
    this.delta_time = 0;
    this.smooth_delta_time = 0;
    this.elapsed_time = 0;
  }

  update(data)
  {
    Object.assign(this, data);
  }

  dispose()
  {

  }
}

const time = new Time();
export { time as Time };
