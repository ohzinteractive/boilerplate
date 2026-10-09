interface ParticleForces
{
  return_to_origin_force: number;
  mouse_displacement_force: number;
  mouse_displacement_noise_strength: number;
}

class Settings
{
  camera: { fov: number };
  debug_mode: boolean;
  dev_bridge: { enabled: boolean; port: number };
  dpr: number;
  hdr: boolean;
  particles: {
    size: number;
    base_brightness: number;
    constant_noise_strength: number;
    opacity_range: { min: number; max: number };
    blur_distance: number;
    blur_size: number;
    blur_opacity: number;
    blur_exponent: number;
    hdr_boost: number;
    webgl_density: number;
    mobile_density: number;
  };
  particles_normal: ParticleForces;
  particles_turbo: ParticleForces;

  constructor()
  {
    this.debug_mode = false;
    this.dpr = 1;

    // Render to an HDR canvas when the display supports it (WebGPU only)
    this.hdr = window.matchMedia('(dynamic-range: high)').matches;

    this.camera = {
      fov: 60
    };

    // Demo particle look, ported from the OHZI lab landing
    this.particles = {
      size: 0.011,
      base_brightness: 1,
      constant_noise_strength: 0.0125,
      opacity_range: { min: 0.45, max: 1.0 },
      blur_distance: 0.5,
      blur_size: 3,
      blur_opacity: 1,
      blur_exponent: 1.6,
      // Brightness of displaced particles on HDR displays (1 = same as SDR)
      hdr_boost: 3,
      // Fraction of the particles drawn on the WebGL fallback, which draws them bigger to compensate
      webgl_density: 0.5,
      // Fraction of the particles drawn on phones and tablets, on top of webgl_density
      mobile_density: 0.5
    };

    // Forces at rest and while the pointer is held down
    this.particles_normal = {
      return_to_origin_force: 0.1,
      mouse_displacement_force: 60,
      mouse_displacement_noise_strength: 2.45
    };
    this.particles_turbo = {
      return_to_origin_force: 15,
      mouse_displacement_force: 50,
      mouse_displacement_noise_strength: 4.13
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
export type { ParticleForces };
