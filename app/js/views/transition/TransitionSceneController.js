import { ViewManager } from 'ohzi-core';
import { Sections } from '../Sections';

class TransitionSceneController
{
  constructor()
  {
    this.next_scene = undefined;
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene = ViewManager.get(Sections.HOME).scene;
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    if (!this.next_scene.is_loaded)
    {
      this.next_scene.load();
    }
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    // this.next_scene.update_loading_state();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {

  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }

  set_next_scene(next_scene)
  {
    this.next_scene = next_scene;
  }

  is_ready_to_exit()
  {
    this.next_scene.update_loading_state();

    if (this.next_scene.is_loaded)
    {
      return true;
    }

    return false;
  }

  get loading_progress()
  {
    return this.next_scene.loading_progress;
  }
}

export { TransitionSceneController };
