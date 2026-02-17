import { Graphics, NormalRender } from 'ohzi-core';
import { Settings } from '../Settings';

export class GraphicsInitializer
{
  init(core_attributes, renderer_attributes)
  {
    this.normal_render_mode = new NormalRender();

    Graphics.init({
      core_attributes,
      renderer_attributes,
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
