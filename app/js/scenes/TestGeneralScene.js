
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import { test_general_objects } from '../../data/assets/test_general/test_general_objects';
import { test_general_textures } from '../../data/assets/test_general/test_general_textures';
import { test_general_sounds } from '../../data/assets/test_general/test_general_sounds';
import { test_general_high_objects } from '../../data/assets/test_general/high/test_general_high_objects';
import { test_general_high_textures } from '../../data/assets/test_general/high/test_general_high_textures';

import { Debug, Grid } from 'ohzi-core';

export default class TestGeneralScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.TEST_GENERAL,
      scene_objects: test_general_objects,
      scene_textures: test_general_textures,
      scene_sounds: test_general_sounds,
      scene_high_objects: test_general_high_objects,
      scene_high_textures: test_general_high_textures,
      scene_high_sounds: test_general_sounds
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
