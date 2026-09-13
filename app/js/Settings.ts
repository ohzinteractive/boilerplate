class Settings
{
  camera: { fov: number };
  debug_mode: boolean;
  dev_bridge: { enabled: boolean; port: number };
  dpr: number;

  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    this.camera = {
      fov: 60
    };

    // Dev-only bridge to the ohzi-mcp server. Stripped from production
    // builds by the import.meta.env.DEV guard in MainApplication.
    // Validation mirrors resolve_port() in the mcp server so a bad value
    // falls back instead of producing ws://127.0.0.1:NaN.
    const port = Number.parseInt(import.meta.env.OHZI_MCP_PORT ?? '', 10);
    const port_is_valid = Number.isInteger(port) && port > 0 && port < 65536;

    this.dev_bridge = {
      enabled: true,
      port: port_is_valid ? port : 7317
    };
  }
}

const settings = new Settings();
export { settings as Settings };
