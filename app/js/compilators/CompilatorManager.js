class CompilatorManager
{
  constructor(compilators)
  {
    this.compilators = compilators;

    this.index = 0;
  }

  update()
  {
    if (!this.is_finished())
    {
      if (this.compilators[this.index].finished)
      {
        this.index++;
      }
      else
      {
        this.compilators[this.index].update();
      }
    }
  }

  is_finished()
  {
    return this.index === this.compilators.length;
  }
}

export { CompilatorManager };
