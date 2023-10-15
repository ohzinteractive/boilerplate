// Formerly SharedSettings
class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;
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
    this.dpr = data.dpr;

    this.general = data.general;
  }

  // Called in Main thread
  set_debug_mode(debug_mode)
  {
    this.debug_mode = debug_mode;

    this.needs_update = true;
  }

  // Called in Main thread
  set_dpr(dpr)
  {
    this.dpr = dpr;
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
      dpr: this.dpr,
      general: this.general,
      use_offscreen_canvas: this.use_offscreen_canvas
    };

    return data;
  }
}

const settings = new Settings();
export { settings as Settings };
