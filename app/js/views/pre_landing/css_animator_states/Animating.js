import { Idle } from './Idle';

class Animating
{
  constructor()
  {
    this.t = 0;
    this.easing_function_t = 0;
  }

  get is_animating()
  {
    return true;
  }

  on_enter(animator)
  {
  }

  update(delta_time, animator)
  {
    this.t += delta_time / animator.duration;

    this.easing_function_t = animator.easing_function(this.t);
    this.easing_function_t = this.clamp(this.easing_function_t, 0, 1);

    animator.set_property_value(this.lerp(animator.from, animator.to, this.easing_function_t));

    if (this.easing_function_t >= 0.9999)
    {
      animator.set_property_value(animator.to);

      animator.set_current_state(new Idle());
      animator.finished_callback(animator);
    }
  }

  on_exit(view)
  {

  }

  clamp(value, min, max)
  {
    return Math.max(min, Math.min(max, value));
  }

  lerp(x, y, t)
  {
    return (1 - t) * x + t * y;
  }
}

export { Animating };
