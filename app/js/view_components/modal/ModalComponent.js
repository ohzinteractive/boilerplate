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

    this.load_html_videos();
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

  hide(next_state_name, next_state_collision)
  {
    super.hide(next_state_name, next_state_collision);
  }
}

const modal_component = new ModalComponent();
export { modal_component as ModalComponent };
