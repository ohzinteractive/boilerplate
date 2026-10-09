import { BlitNodeMaterial } from 'ohzi-core';
import { saturate, sRGBTransferEOTF, vec4 } from 'three/tsl';
import type { Node } from 'three/webgpu';

// Blits a target that holds sRGB encoded colors, decoding them to linear.
// The renderer's sRGB output conversion then puts the stored values on screen as they are.
export class SRGBDecodeBlitMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    this.fragmentNode = vec4(sRGBTransferEOTF(saturate(this.sample_main_tex().rgb)) as Node<'vec3'>, 1);
  }
}
