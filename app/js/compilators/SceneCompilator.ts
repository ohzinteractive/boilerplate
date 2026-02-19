import { Compilator } from "ohzi-core";

// See SceneCompilatorExample.js for an example of how to use this class
export class SceneCompilator extends Compilator
{
  finished: boolean;
  
  constructor()
  {
    super();
    
    this.finished = false;
  }

  start()
  {

  }

  update()
  {
    this.finished = true;
  }
}
