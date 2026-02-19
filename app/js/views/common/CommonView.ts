import { ApplicationView } from 'ohzi-core';
import type { HomeSceneController } from '../home/HomeSceneController';
import type { HomeTransitionController } from '../home/HomeTransitionController';

export class CommonView extends ApplicationView
{
    scene_controller: HomeSceneController;
  transition_controller: HomeTransitionController;
}
