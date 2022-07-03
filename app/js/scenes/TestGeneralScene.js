
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import scene_objects from '../../data/assets/test_general/test_general_objects.json';
import scene_textures from '../../data/assets/test_general/test_general_textures.json';
import scene_sounds from '../../data/assets/test_general/test_general_sounds.json';

import scene_high_objects from '../../data/assets/test_general/high/test_general_high_objects.json';
import scene_high_textures from '../../data/assets/test_general/high/test_general_high_textures.json';
import scene_high_sounds from '../../data/assets/test_general/high/test_general_high_sounds.json';

import { Debug, Grid } from 'ohzi-core';

export default class TestGeneralScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.TEST_GENERAL,
      scene_objects,
      scene_textures,
      scene_sounds,
      scene_high_objects,
      scene_high_textures,
      scene_high_sounds
    });
  }

  init()
  {
    this.add(Debug.draw_axis());
    this.add(new Grid());
  }

  update()
  {
    super.update();
  }

  on_assets_ready()
  {
    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }
}
