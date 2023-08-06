// __MODAL_STATES_IMPORTS__
import { HTMLUtilities } from 'ohzi-core';

import { AbstractModalComponent } from 'ohzi-components';

class ModalComponent extends AbstractModalComponent
{
  start()
  {
    super.start();

    this.states = {
      // __MODAL_STATES__
    };
  }

  on_enter()
  {
    super.on_enter();
  }

  on_exit()
  {
    super.on_exit();
  }

  update(current_state_data)
  {
    super.update(current_state_data);
  }

  show_state(state_name, collision)
  {
    super.show_state(state_name, collision);

    const container = this.states[state_name].container;

    HTMLUtilities.load_images(container);
    HTMLUtilities.load_videos(container);
  }

  hide(next_state_name, next_state_collision)
  {
    super.hide(next_state_name, next_state_collision);
  }
}

const modal_component = new ModalComponent();
export { modal_component as ModalComponent };
