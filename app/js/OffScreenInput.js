
class OffScreenInput
{
  constructor()
  {
    this.clicked = false;

    this.NDC = { x: 0, y: 0 };
    this.NDC_delta = { x: 0, y: 0 };

    this.left_mouse_button_pressed = false;
    this.left_mouse_button_down = false;
    this.left_mouse_button_released = false;

    this.right_mouse_button_pressed = false;
    this.right_mouse_button_down = false;
    this.right_mouse_button_released = false;

    this.pointer_count = 0;

    this.scroll_delta = 0;
    this.zoom_delta = 0;

    this.keyboard_keys = {};
  }

  init()
  {
  }

  update(data)
  {
    this.clicked = data.clicked;

    this.NDC = data.NDC;
    this.NDC_delta = data.NDC_delta;

    this.left_mouse_button_pressed = data.left_mouse_button_pressed;
    this.left_mouse_button_down = data.left_mouse_button_down;
    this.left_mouse_button_released = data.left_mouse_button_released;

    this.right_mouse_button_pressed = data.right_mouse_button_pressed;
    this.right_mouse_button_down = data.right_mouse_button_down;
    this.right_mouse_button_released = data.right_mouse_button_released;

    this.pointer_count = data.pointer_count;

    this.scroll_delta = data.scroll_delta;
    this.zoom_delta = data.zoom_delta;

    this.keyboard_keys = data.keyboard_keys;
  }

  is_key_pressed(key_name)
  {
    const key = this.keyboard_keys[key_name];
    if (key)
    {
      return key.pressed;
    }
    return false;
  }

  is_key_down(key_name)
  {
    const key = this.keyboard_keys[key_name];
    if (key)
    {
      return key.down;
    }
    return false;
  }

  is_key_released(key_name)
  {
    const key = this.keyboard_keys[key_name];
    if (key)
    {
      return key.released;
    }

    return false;
  }

  clear()
  {
    this.NDC = { x: 0, y: 0 };
  }
}

const offscreen_input = new OffScreenInput();
export { offscreen_input as OffScreenInput };
