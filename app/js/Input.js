// Formerly SharedInput
class Input
{
  constructor()
  {
  }

  init()
  {
    this.clicked = false;
    this.over_ui = false;

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

  update(data)
  {
    Object.assign(this, data);
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

  dispose()
  {

  }
}

const input = new Input();
export { input as Input };
