import { OMath } from 'ohzi-core';
import { MainToWorker } from '../../MainToWorker';
import { Sections, SectionsURLs } from '../Sections';
import { CommonView } from '../common/CommonView';

class TransitionView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.TRANSITION,
      url: SectionsURLs.TRANSITION,
      container: document.querySelector('.transition')
    });

    this.next_view_name = '';

    this.current_progress = 0;
    this.target_progress = 0;
  }

  start()
  {
    this.progress_bar = document.querySelector('.transition__progress-bar-fill');
  }

  before_enter()
  {
    this.current_progress = 0;
    this.target_progress = 0;

    // HTMLUtilities.load_images(this.container);
  }

  on_enter()
  {
    super.on_enter();
  }

  before_exit()
  {
    super.before_exit();
  }

  on_exit()
  {
  }

  update(loading_progress)
  {
    this.__update_progress(loading_progress);
  }

  update_enter_transition(global_view_data, transition_progress, loading_progress)
  {
    this.__update_progress(loading_progress);
  }

  update_exit_transition(global_view_data, transition_progress, loading_progress)
  {
    this.__update_progress(loading_progress);
  }

  set_next_view_name(next_view_name)
  {
    MainToWorker.post('set_next_view_controller_name', { next_view_controller_name: next_view_name });
  }

  __update_progress(loading_progress)
  {
    const next_progress = this.__round(loading_progress, 2);
    this.target_progress = next_progress < this.target_progress ? this.target_progress : next_progress;

    this.current_progress += (this.target_progress - this.current_progress) * 0.05;
    this.current_progress = OMath.clamp(this.current_progress, 0.2, 1);

    this.progress_bar.style.transform = `translate3d(${this.current_progress * 100}%,0,0)`;
  }

  __round(value, precision)
  {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}

export { TransitionView };
