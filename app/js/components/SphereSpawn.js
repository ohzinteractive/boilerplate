import {SceneManager} from 'ohzi-core';
import {Time} from 'ohzi-core';
export default class SphereSpawn
{
  constructor()
  {
    this.spheres = [];
    let geo = new THREE.SphereBufferGeometry(0.1);
    let mat = new THREE.MeshBasicMaterial();
    for(let i=0; i< 10000; i++)
    {
      this.spheres.push(new THREE.Mesh(geo, mat));
      SceneManager.current.add(this.spheres[this.spheres.length-1]);
    }
  }

  update()
  {
    for(let i=0; i< this.spheres.length; i++)
    {
      let angle = i * 1.61803398875 * (2 * Math.PI);

      let distance = Math.pow((i/(this.spheres.length-1))*200, settings.scale);

      this.spheres[i].position.set( Math.cos(angle)*distance,
                                    0,
                                    Math.sin(angle)*distance);
    }
  }
}