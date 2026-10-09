import type { ActionSequencer } from 'ohzi-core';
import { SceneManager, ViewManager } from 'ohzi-core';
import { Sections } from '../Sections';
import { CommonSceneController } from '../common/CommonSceneController';
import type { DemoView } from './DemoView';

// import { DemoScene } from '../../scenes/DemoScene';

export class DemoSceneController extends CommonSceneController
{
  constructor()
  {
    super();
  }

  start()
  {
    // Use this line to reuse HomeScene
    this.scene = (ViewManager.get(Sections.HOME) as DemoView).scene;

    // Use this line to use own scene
    // this.scene = new DemoScene();
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
