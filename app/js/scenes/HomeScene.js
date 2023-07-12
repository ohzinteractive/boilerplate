
import { AbstractScene } from './common/AbstractScene';

import { Sections } from '../views/Sections';

import { home_objects } from '../../data/assets/home/home_objects';
import { home_textures } from '../../data/assets/home/home_textures';
import { home_sounds } from '../../data/assets/home/home_sounds';
import { home_high_objects } from '../../data/assets/home/high/home_high_objects';
import { home_high_textures } from '../../data/assets/home/high/home_high_textures';
import { home_high_sounds } from '../../data/assets/home/high/home_high_sounds';

import { Debug, Grid } from 'ohzi-core';

// import { AmbientLight, DirectionalLight } from 'three';
class HomeScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.HOME,
      scene_objects: home_objects,
      scene_textures: home_textures,
      scene_sounds: home_sounds,
      scene_high_objects: home_high_objects,
      scene_high_textures: home_high_textures,
      scene_high_sounds: home_high_sounds
    });
  }

  init()
  {
    if (window.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  // add_lights()
  // {
  //   const light = new AmbientLight('#FFFFFF', 0.9);
  //   this.add(light);

  //   const directional_light = new DirectionalLight('#FFFFFF', 0.5);
  //   directional_light.position.set(0, 10, 20);
  //   this.add(directional_light);
  // }

  update()
  {
    super.update();
  }

  on_assets_ready()
  {
    super.on_assets_ready();

    // this.add_lights();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }
}

export { HomeScene };
