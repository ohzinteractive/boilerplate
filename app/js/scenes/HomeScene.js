
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import scene_objects from '../../data/assets/home/home_objects.json';
import scene_textures from '../../data/assets/home/home_textures.json';
import scene_sounds from '../../data/assets/home/home_sounds.json';

import scene_high_objects from '../../data/assets/home/high/home_high_objects.json';
import scene_high_textures from '../../data/assets/home/high/home_high_textures.json';
import scene_high_sounds from '../../data/assets/home/high/home_high_sounds.json';

export default class HomeScene extends AbstractScene
{
  constructor()
  {
    super(scene_objects, scene_textures, scene_sounds,
      scene_high_objects, scene_high_textures, scene_high_sounds);

    this.name = Sections.HOME;
  }

  init()
  {

  }

  update()
  {
    super.update();
  }
}
