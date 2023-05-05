// __MODAL_STATES_IMPORTS__

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
  }

  hide(next_state_name)
  {
    super.hide(next_state_name);
  }
}

const modal_component = new ModalComponent();
export { modal_component as ModalComponent };
