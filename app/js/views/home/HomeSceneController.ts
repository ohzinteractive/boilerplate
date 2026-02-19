import type { AbstractScene, ActionSequencer } from 'ohzi-core';
import { SceneManager } from 'ohzi-core';
import { HomeScene } from '../../scenes/HomeScene';
import { CommonSceneController } from '../common/CommonSceneController';

export class HomeSceneController extends CommonSceneController
{
  scene: AbstractScene;

  constructor()
  {
    super();
  }

  start()
  {
    this.scene = new HomeScene();
  }

  before_enter()
  {
    // this.scene.setup_camera();

    SceneManager.current = this.scene;
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
