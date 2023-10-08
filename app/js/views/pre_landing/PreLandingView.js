
import { CSSAnimator } from './CSSAnimator';

class PreLandingView
{
  constructor()
  {
    this.elapsed_time = 1;
  }

  start()
  {
    this.container = document.querySelector('.pre-landing');
    this.container.addEventListener('click', this.hide.bind(this));

    this.opacity_animator = new CSSAnimator({
      element: this.container,
      css_property: 'opacity',
      from: 1,
      to: 0,
      duration: 1,
      finished_callback: this.on_exit.bind(this)
    });

    this.on_enter();
  }

  on_enter()
  {
    this.container.classList.remove('hidden');

    this.hidden = false;

    this.frame_id = requestAnimationFrame(this.update.bind(this));
  }

  on_exit()
  {
    this.container.classList.add('hidden');

    this.hidden = true;
  }

  update(elapsed_time)
  {
    if (this.hidden)
    {
      return;
    }

    this.delta_time = (elapsed_time - this.elapsed_time) / 1000;
    this.elapsed_time = elapsed_time;

    this.opacity_animator.update(this.delta_time);

    this.frame_id = requestAnimationFrame(this.update.bind(this));
  }

  hide()
  {
    this.opacity_animator.animate();
  }
}

export { PreLandingView };
