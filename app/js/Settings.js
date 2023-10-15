// Formerly SharedSettings
class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.use_offscreen_canvas = true;

    this.general = {
      value: 0
    };

    this.needs_update = true;
  }

  // Called in Worker
  update(data)
  {
    this.debug_mode = data.debug_mode;
    this.use_offscreen_canvas = data.use_offscreen_canvas;

    this.general = data.general;
  }

  // Called in Main thread
  set_debug_mode(debug_mode)
  {
    this.debug_mode = debug_mode;

    this.needs_update = true;
  }

  // Called in Main thread
  set_needs_update(needs_update)
  {
    this.needs_update = needs_update;
  }

  // Called in Main thread
  set_use_offscreen_canvas(use_offscreen_canvas)
  {
    this.use_offscreen_canvas = use_offscreen_canvas;

    this.needs_update = true;
  }

  // Called in Main thread
  clear()
  {
    this.needs_update = false;
  }

  // Called in Main thread
  to_json()
  {
    const data = {
      debug_mode: this.debug_mode,
      general: this.general,
      use_offscreen_canvas: this.use_offscreen_canvas
    };

    return data;
  }
}

const settings = new Settings();
export { settings as Settings };
