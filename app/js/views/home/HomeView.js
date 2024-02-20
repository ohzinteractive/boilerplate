// import { AudioManager } from 'ohzi-components';
import { Sections, SectionsURLs } from '../Sections';
import { CommonView } from '../common/CommonView';

import { home_high_sounds } from '../../../data/assets/home/high/home_high_sounds';

class HomeView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.HOME,
      url: SectionsURLs.HOME,
      container: document.querySelector('.home')
    });

    this.sounds_data = home_high_sounds;
  }

  start()
  {
    super.start();

    // AudioManager.setup_sounds_names([...this.sounds_data]);
  }

  before_enter()
  {
    super.before_enter();
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
    super.on_exit();
  }

  update()
  {
    super.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { HomeView };
