import { SceneLoadingState } from './SceneLoadingState';

class RegularAssetsState extends SceneLoadingState
{
  // constructor(scene_objects, scene_textures, scene_sounds)
  // {
  //   super(scene_objects, scene_textures, scene_sounds);
  // }

  on_enter()
  {
    super.on_enter();
    // this.setup_loader();
  }

  on_exit()
  {
    super.on_exit();
  }

  update()
  {
    super.update();

    if (this.is_loaded())
    {
      if (this.is_compiled())
      {
        this.scene.on_assets_ready();
      }
    }
  }
}

export { RegularAssetsState };
