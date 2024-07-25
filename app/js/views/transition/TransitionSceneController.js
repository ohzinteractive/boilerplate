import { ViewManager } from 'ohzi-core';
import { Sections } from '../Sections';

class TransitionSceneController
{
  constructor()
  {
    this.next_scene = undefined;
  }

  start()
  {
    this.scene = ViewManager.get(Sections.HOME).scene;
  }

  before_enter()
  {
    if (!this.next_scene.is_loaded)
    {
      this.next_scene.load();
    }
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
    // this.next_scene.update_loading_state();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {

  }

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
