import { BaseApplication, Input } from 'ohzi-core';
import { NormalRender } from 'ohzi-core';
import { Graphics } from 'ohzi-core';
import { ResourceContainer } from 'ohzi-core';
import { ViewManager } from 'ohzi-core';
import { ViewContext } from 'ohzi-core';

import DatGUI from './components/DatGUI';
import SceneController from './components/SceneController';
import HomeView from './views/home/HomeView';
import TransitionView from './views/transition/TransitionView';
import TestGeneralView from './views/test_general/TestGeneralView';

import { sRGBEncoding } from 'three';

import { Sections } from './views/Sections';

export default class MainApplication extends BaseApplication
{
  init()
  {
    this.input = Input;
    this.scene_controller = SceneController;
    this.normal_render_mode = new NormalRender();

    this.scene_controller.init();

    Graphics.set_state(this.normal_render_mode);
    Graphics._renderer.outputEncoding = sRGBEncoding;
    Graphics._renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';

    DatGUI.init();
  }

  on_enter()
  {
    this.config = ResourceContainer.get('config');

    const glb = ResourceContainer.get('glb');
    this.glb = glb;

    // this.__download_materials(glb.scene);
    this.__download_textures(glb.scene);

    this.sections = Sections;

    ViewContext.set_app(this);

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive');

    this.scene_controller.start();

    // __COMPONENTS__

    // __SECTIONS__
    this.home_view = new HomeView();
    this.transition_view = new TransitionView();
    this.test_general_view = new TestGeneralView();
    this.home_view.start();
    this.transition_view.start();
    this.test_general_view.start();

    DatGUI.start();

    window.onpopstate = this.go_to_url_section.bind(this);

    this.go_to_url_section();
  }

  __download_textures(scene, file_name = 'textures')
  {
    const textures = {};

    scene.traverse((object) =>
    {
      if (object.material)
      {
        const object_json = {};
        // object_json.name = object.name;

        const material = object.material;

        if (material.map)
        {
          console.log(material.map);
          object_json.map_url = material.map.image.src.replace('http://localhost:1234/', '');
        }

        if (material.alphaMap)
        {
          object_json.alpha_map_url = material.alphaMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.aoMap)
        {
          object_json.ao_map_url = material.aoMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.bumpMap)
        {
          object_json.bump_map_url = material.bumpMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.displacementMap)
        {
          object_json.displacement_map_url = material.displacementMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.emissiveMap)
        {
          object_json.emissive_map_url = material.emissiveMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.envMap)
        {
          object_json.env_map_url = material.envMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.lightMap)
        {
          object_json.light_map_url = material.lightMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.metalnessMap)
        {
          object_json.metalness_map_url = material.metalnessMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.normalMap)
        {
          object_json.normal_map_url = material.normalMap.image.src.replace('http://localhost:1234/', '');
        }

        if (material.roughnessMap)
        {
          object_json.roughness_map_url = material.roughnessMap.image.src.replace('http://localhost:1234/', '');
        }

        if (Object.keys(object_json).length > 0)
        {
          textures[object.name] = object_json;
        }
      }
    });

    this.__download_json(textures, file_name);
  }

  __download_materials(scene, file_name = 'materials')
  {
    const materials = {};

    scene.traverse(child =>
    {
      const object = child.clone();

      if (object.geometry)
      {
        if (object.material.map)
        {
          object.material.map = undefined;
        }
        if (object.material.alphaMap)
        {
          object.material.alphaMap = undefined;
        }
        if (object.material.aoMap)
        {
          object.material.aoMap = undefined;
        }
        if (object.material.bumpMap)
        {
          object.material.bumpMap = undefined;
        }
        if (object.material.displacementMap)
        {
          object.material.displacementMap = undefined;
        }
        if (object.material.emissiveMap)
        {
          object.material.emissiveMap = undefined;
        }
        if (object.material.envMap)
        {
          object.material.envMap = undefined;
        }
        if (object.material.lightMap)
        {
          object.material.lightMap = undefined;
        }
        if (object.material.metalnessMap)
        {
          object.material.metalnessMap = undefined;
        }
        if (object.material.normalMap)
        {
          object.material.normalMap = undefined;
        }
        if (object.material.roughnessMap)
        {
          object.material.roughnessMap = undefined;
        }
        if (object.material)
        {
          materials[object.name] = object.material.toJSON();
        }
      }
    });

    this.__download_json(materials, file_name);
  }

  __download_json(data, file_name)
  {
    const dlAnchorElem = document.createElement('a');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    dlAnchorElem.setAttribute('href',     dataStr);
    dlAnchorElem.setAttribute('download', `${file_name}.json`);
    dlAnchorElem.click();
  }

  go_to_url_section()
  {
    const next_view = ViewManager.get_by_url(window.location.pathname) || this.home_view;

    this.transition_view.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  go_to(section, change_url = true, skip = false)
  {
    if (window.debug_mode || window.skip_mode)
    {
      skip = true;
    }

    ViewManager.go_to_view(section, change_url, skip);
  }

  go_to_scene(view_name)
  {
    const next_view = ViewManager.get(view_name);

    this.transition_view.set_next_view(next_view);
    this.go_to(Sections.TRANSITION, false, false);
  }

  update()
  {
    this.scene_controller.update();
  }
}
