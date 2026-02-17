import { Compilator } from "ohzi-core";

export class AudiosCompilator extends Compilator
{
  constructor(textures_names)
  {
    super();
    
    this.finished = false;

    this.textures_names = textures_names;
  }

  start()
  {

  }

  update()
  {
    this.finished = true;
  }
}
