import { Time } from 'ohzi-core';
import { Configuration } from 'ohzi-core';

import { Math as TMath } from 'three';

import LoaderViewBase from './LoaderViewBase';
import FPSCounter from '../../components/FPSCounter';

export default class LoaderView extends LoaderViewBase
{
  constructor(api)
  {
    super(api);
  }

  on_assets_ready()
  {
    this.scene.on_assets_ready();

    if (process.env.NODE_ENV === 'development')
    {
      this.api.start_main_app();
    }
  }

  set_progress(progress)
  {
    // this.target_progress = this.__round(progress / 3, 1);
    this.target_progress = this.__round(progress, 2);
  }

  __update_progress()
  {
    // this.progress = this.target_progress + this.round((transition_progress / 3) * 2, 2);
    this.current_progress += (this.target_progress - this.current_progress) * 0.05;
    this.current_progress = TMath.clamp(this.current_progress, 0, 1);

    this.progress_bar.style.transform = `translate3d(${this.current_progress * 100}%,0,0)`;
  }

  __check_performance()
  {
    if (this.performance_t > 5 && FPSCounter.avg < 40)
    {
      Configuration.dpr -= 0.25;
      Configuration.dpr = TMath.clamp(Configuration.dpr, 0.75, 10);

      this.performance_t = 0;
    }

    this.performance_t += Time.delta_time;
  }

  __set_api_ready(is_api_ready)
  {
    this.is_api_ready = is_api_ready;
  }

  __round(value, precision)
  {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
