import { Graphics, NormalRender } from 'ohzi-core';
import type { CoreAttributes } from 'ohzi-core/src/Graphics';
import type { Renderer } from 'three/webgpu';
import { Settings } from '../Settings';

export class GraphicsInitializer
{
  normal_render_mode: NormalRender;

  init(renderer: Renderer, core_attributes: CoreAttributes)
  {
    this.normal_render_mode = new NormalRender();

    Graphics.init({
      renderer,
      core_attributes,
      dpr: Settings.dpr
    });

    Graphics.set_state(this.normal_render_mode);
    // Graphics._renderer.outputColorSpace = LinearSRGBColorSpace;

    Graphics._renderer.debug.checkShaderErrors = import.meta.env.DEV;

    // Graphics._renderer.physicallyCorrectLights = true;
    // Graphics._renderer.toneMapping = ACESFilmicToneMapping;
    // Graphics._renderer.toneMappingExposure = 0.7;
  }
}
