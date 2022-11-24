
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import { test_objects } from '../../data/assets/test/test_objects';
import { test_textures } from '../../data/assets/test/test_textures';
import { test_sounds } from '../../data/assets/test/test_sounds';
import { test_high_objects } from '../../data/assets/test/high/test_high_objects';
import { test_high_textures } from '../../data/assets/test/high/test_high_textures';

import { Debug, Grid } from 'ohzi-core';

export default class TestScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.TEST,
      scene_objects: test_objects,
      scene_textures: test_textures,
      scene_sounds: test_sounds,
      scene_high_objects: test_high_objects,
      scene_high_textures: test_high_textures,
      scene_high_sounds: test_sounds
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
