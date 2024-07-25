import { AbstractScene } from 'ohzi-core';

import { AudiosCompilator } from '../../compilators/AudiosCompilator';
import { SceneCompilator } from '../../compilators/SceneCompilator';
import { TexturesCompilator } from '../../compilators/TexturesCompilator';

export class CommonScene extends AbstractScene
{
  constructor({ name })
  {
    super({
      name: name,
      compilators: {
        SceneCompilator: SceneCompilator,
        TexturesCompilator: TexturesCompilator,
        AudiosCompilator: AudiosCompilator
      }
    });
  }
}
