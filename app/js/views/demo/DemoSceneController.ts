import type { ActionSequencer } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';
import { DemoScene } from '../../scenes/DemoScene';
import { CommonSceneController } from '../common/CommonSceneController';

export class DemoSceneController extends CommonSceneController
{
  scene: DemoScene;

  constructor()
  {
    super();
  }

  start()
  {
    this.scene = new DemoScene();
  }

  before_enter()
  {
    this.scene.setup_camera();
    this.scene.use_display_output(true);

    SceneManager.current = this.scene;
  }

  on_enter()
  {
  }

  before_exit()
  {
    this.scene.use_display_output(false);
  }

  on_exit()
  {
  }

  update()
  {
    this.scene.update();
  }

  update_enter_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
    this.scene.update();
  }

  update_exit_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
  }
}
