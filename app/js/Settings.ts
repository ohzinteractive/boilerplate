class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    this.camera = {
      fov: 60
    };
  }
}

const settings = new Settings();
export { settings as Settings };
