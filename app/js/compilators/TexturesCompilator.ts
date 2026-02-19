import { Compilator } from "ohzi-core";
export class TexturesCompilator extends Compilator
{
  finished: boolean;
  textures_names: string[];

  constructor(textures_names: string[])
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
