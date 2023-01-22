class TexturesCompilator
{
  constructor(textures_names)
  {
    this.finished = false;

    this.textures_names = textures_names;
  }

  update()
  {
    this.finished = true;
  }
}

export { TexturesCompilator };
