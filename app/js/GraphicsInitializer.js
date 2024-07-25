import { Graphics, NormalRender } from 'ohzi-core';
import { Settings } from './Settings';

class GraphicsInitializer
{
  init(canvas, core_attributes, context_attributes, threejs_attributes)
  {
    this.normal_render_mode = new NormalRender();

    Graphics.init({
      canvas,
      core_attributes,
      context_attributes,
      threejs_attributes,
      dpr: Settings.dpr
    });

    Graphics.set_state(this.normal_render_mode);
    // Graphics._renderer.outputColorSpace = LinearSRGBColorSpace;
    Graphics._renderer.debug.checkShaderErrors = process.env.NODE_ENV === 'development';

    // Graphics._renderer.physicallyCorrectLights = true;
    // Graphics._renderer.toneMapping = ACESFilmicToneMapping;
    // Graphics._renderer.toneMappingExposure = 0.7;
  }
}

export { GraphicsInitializer };
