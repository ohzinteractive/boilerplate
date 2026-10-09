import { BlitNodeMaterial } from 'ohzi-core';
import { max, sRGBTransferEOTF, vec4 } from 'three/tsl';
import type { Node } from 'three/webgpu';

// Blits a target that holds sRGB encoded colors, decoding them to linear.
// The renderer's sRGB output conversion then puts the stored values on screen as they are.
// Values above 1 are kept, for HDR output.
export class SRGBDecodeBlitMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    this.fragmentNode = vec4(sRGBTransferEOTF(max(this.sample_main_tex().rgb, 0)) as Node<'vec3'>, 1);
  }
}
