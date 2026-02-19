class Layers
{
  bloom: number;
  instanced_occluder: number;
  occluder: number;
  reflectable: number;
  
  constructor()
  {
    this.reflectable = 1;
    this.bloom = 2;
    this.occluder = 3;
    this.instanced_occluder = 4;
  }
}
const layers = new Layers();
export { layers as Layers };
