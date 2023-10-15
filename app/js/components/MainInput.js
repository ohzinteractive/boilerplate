import { KeyboardInput } from 'ohzi-core';
import { InputController } from 'pit-js';

class MainInput extends InputController
{
  constructor()
  {
    super();

    // TODO: set needs_update to true only if input was changed
    this.needs_update = true;
  }

  init(container, keyboard_input_container)
  {
    super.init(container);

    this.clicked = false;

    this.captured_NDC = { x: 0, y: 0 };
    this.current_NDC_delta = { x: 0, y: 0 };

    this.keyboard = new KeyboardInput();

    this.keyboard.init(keyboard_input_container);
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
    }

    if (this.left_mouse_button_down)
    {
      this.current_NDC_delta.x += Math.abs(this.NDC_delta.x);
      this.current_NDC_delta.y += Math.abs(this.NDC_delta.y);
    }

    if (this.left_mouse_button_released)
    {
      if (this.current_NDC_delta.x < 0.001 || this.current_NDC_delta.y < 0.001)
      {
        this.clicked = true;
      }

      this.current_NDC_delta = { x: 0, y: 0 };
    }
  }

  clear()
  {
    super.clear();

    this.clicked = false;
    // this.needs_update = false;

    this.keyboard.clear();
  }

  is_key_pressed(key_name)
  {
    return this.keyboard.is_key_pressed(key_name);
  }

  is_key_down(key_name)
  {
    return this.keyboard.is_key_down(key_name);
  }

  is_key_released(key_name)
  {
    return this.keyboard.is_key_released(key_name);
  }

  to_json()
  {
    const data = {
      clicked: this.clicked,
      NDC: this.NDC,
      NDC_delta: this.NDC_delta,

      left_mouse_button_pressed: this.left_mouse_button_pressed,
      left_mouse_button_down: this.left_mouse_button_down,
      left_mouse_button_released: this.left_mouse_button_released,

      right_mouse_button_pressed: this.right_mouse_button_pressed,
      right_mouse_button_down: this.right_mouse_button_down,
      right_mouse_button_released: this.right_mouse_button_released,

      pointer_count: this.pointer_count,

      scroll_delta: this.scroll_delta,
      zoom_delta: this.zoom_delta,

      keyboard_keys: this.keyboard.keys
    };

    return data;
  }
}

const main_input = new MainInput();
export { main_input as MainInput };
