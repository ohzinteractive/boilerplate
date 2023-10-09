import { OMath } from 'ohzi-core';
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

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.progress_bar = document.querySelector('.transition__progress-bar-fill');
  }

  show()
  {
    super.show();
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.current_progress = 0;
    this.target_progress = 0;

    // HTMLUtilities.load_images(this.container);
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
  }

  // This method is called in every frame right after on_enter is called.
  update(loading_progress)
  {
    this.__update_progress(loading_progress);
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, loading_progress)
  {
    this.__update_progress(loading_progress);
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, loading_progress)
  {
    this.__update_progress(loading_progress);
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
