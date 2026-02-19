import { KeyboardInput, OS } from 'ohzi-core';
import { InputController } from 'pit-js';

class Input extends InputController
{
  constructor()
  {
    super();

    this.clicked = false;

    this.swiped_left = false;
    this.swiped_right = false;
    this.swiped_up = false;
    this.swiped_down = false;

    this.captured_NDC = { x: 0, y: 0 };
    this.current_NDC_delta = { x: 0, y: 0 };
    this.last_delta = { x: 0, y: 0 };

    this.keyboard = new KeyboardInput();
  }

  init(container, keyboard_input_container)
  {
    super.init(container);

    this.keyboard.init(keyboard_input_container);

    this.sensitivity = OS.is_ios ? 0.15 : 0.05;
  }

  dispose()
  {
    super.dispose();

    this.keyboard.dispose();
  }

  update()
  {
    if (this.left_mouse_button_pressed)
    {
      this.captured_NDC.x = this.NDC.x;
      this.captured_NDC.y = this.NDC.y;
      this.last_delta = { x: 0, y: 0 };
    }

    if (this.left_mouse_button_down)
    {
      this.current_NDC_delta.x += Math.abs(this.NDC_delta.x);
      this.current_NDC_delta.y += Math.abs(this.NDC_delta.y);
      this.last_delta.x += this.NDC_delta.x;
      this.last_delta.y += this.NDC_delta.y;
    }

    if (this.left_mouse_button_released)
    {
      if (this.current_NDC_delta.x < 0.001 || this.current_NDC_delta.y < 0.001)
      {
        this.clicked = true;
      }
      else
      {
        if (this.last_delta.x > this.sensitivity)
        {
          this.swiped_right = true;
        }
        else if (this.last_delta.x < -this.sensitivity)
        {
          this.swiped_left = true;
        }
        else if (this.last_delta.y > this.sensitivity)
        {
          this.swiped_up = true;
        }
        else if (this.last_delta.y < -this.sensitivity)
        {
          this.swiped_down = true;
        }
      }
    }
  }

  clear()
  {
    if (this.left_mouse_button_released)
    {
      this.current_NDC_delta = { x: 0, y: 0 };
    }

    super.clear();

    this.clicked = false;
    this.swiped_left = false;
    this.swiped_right = false;
    this.swiped_up = false;
    this.swiped_down = false;

    this.keyboard.clear();
  }
}

const input = new Input();
export { input as Input };
