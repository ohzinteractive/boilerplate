import { ApplicationView } from 'ohzi-core';
import type { CommonSceneController } from './CommonSceneController';
import type { CommonTransitionController } from './CommonTransitionController';

export class CommonView extends ApplicationView
{
  scene_controller: CommonSceneController;
  transition_controller: CommonTransitionController;
}
