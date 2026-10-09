import { Compilator } from 'ohzi-core';

// Fonts need no GPU work, so compilation finishes right away.
export class FontsCompilator extends Compilator
{
  finished: boolean;
  fonts_names: string[];

  constructor(fonts_names: string[])
  {
    super();

    this.finished = false;

    this.fonts_names = fonts_names;
  }

  start()
  {

  }

  update()
  {
    this.finished = true;
  }
}
