
import AbstractScene from './common/AbstractScene';

import { Sections } from '../views/Sections';

import scene_objects from '../../data/assets/home/home_objects.json';
import scene_textures from '../../data/assets/home/home_textures.json';
import scene_sounds from '../../data/assets/home/home_sounds.json';

import scene_high_objects from '../../data/assets/home/high/home_high_objects.json';
import scene_high_textures from '../../data/assets/home/high/home_high_textures.json';
import scene_high_sounds from '../../data/assets/home/high/home_high_sounds.json';

import { Debug, Grid, ResourceContainer, Graphics, SceneManager } from 'ohzi-core';
import { PMREMGenerator } from 'three';
import { HalfFloatType } from 'three';

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

    const pmremGenerator = new PMREMGenerator(Graphics._renderer);
    pmremGenerator.compileEquirectangularShader();

    const hdrEquirect = ResourceContainer.get_resource('env_hdr');
    hdrEquirect.needsUpdate = true;
    hdrEquirect.type = HalfFloatType;
    console.log(hdrEquirect);
    const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
    hdrEquirect.dispose();
    pmremGenerator.dispose();

    SceneManager.current.environment = hdrCubeRenderTarget.texture;
    SceneManager.current.background = hdrCubeRenderTarget.texture;

    const scene = ResourceContainer.get('scene').scene;
    this.add(scene);
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }
}
