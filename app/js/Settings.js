class Settings
{
  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    this.general = {
      value: 0
    };
  }
}

const settings = new Settings();
export { settings as Settings };
