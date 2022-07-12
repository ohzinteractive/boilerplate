
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import scene_objects from '../../data/assets/home/home_objects.json';
import scene_textures from '../../data/assets/home/home_textures.json';
import scene_sounds from '../../data/assets/home/home_sounds.json';

import scene_high_objects from '../../data/assets/home/high/home_high_objects.json';
import scene_high_textures from '../../data/assets/home/high/home_high_textures.json';
import scene_high_sounds from '../../data/assets/home/high/home_high_sounds.json';

import { Debug, Grid } from 'ohzi-core';

// import { AmbientLight, DirectionalLight } from 'three';
export default class HomeScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.HOME,
      scene_objects,
      scene_textures,
      scene_sounds,
      scene_high_objects,
      scene_high_textures,
      scene_high_sounds
    });

    this.name = Sections.HOME;
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
  //   const light = new AmbientLight('#FFFFFF', 1);
  //   this.add(light);

  //   const directional_light = new DirectionalLight('#FFFFFF', 1);
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
