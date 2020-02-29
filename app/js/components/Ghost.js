import EasingFunctions from 'js/core/utilities/EasingFunctions';
import Time from 'js/core/Time';

export default class Ghost extends THREE.Mesh {
	constructor(geometry, material)
	{
    super(geometry, material);

    this.is_showing = false;
    this.t = 0;
  }

  update() {
    if (this.is_showing) {
      this.t += Time.delta_time * 0.1;
      let t2 = EasingFunctions.ease_in_out_cubic(this.t);
      t2 = THREE.Math.clamp(t2, 0, 1);

      this.material.opacity = THREE.Math.lerp(0, 1, t2);
    }
  }

  show() {
    this.is_showing = true;
  }

}
