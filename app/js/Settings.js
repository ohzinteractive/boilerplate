class Settings
{
  constructor()
  {
    this.debug_mode = false;

    this.general = {
      value: 0
    };
  }
}

const settings = new Settings();
export { settings as Settings };
