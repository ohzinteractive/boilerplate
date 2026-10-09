import { abs, dot, float, floor, Fn, max, min, normalize, step, vec2, vec3, vec4 } from 'three/tsl';
import type { Node } from 'three/webgpu';

// TSL port of Ashima Arts' 3D simplex noise (MIT, github.com/ashima/webgl-noise)
// and the curl noise built on top of it, as used by the lab particle shaders.
// Each function has a layout so it compiles to one shader function instead of
// being inlined at every call (curl_noise alone calls snoise 18 times).

const mod289_vec3 = (x: Node<'vec3'>) => x.sub(floor(x.mul(1 / 289)).mul(289));
const mod289_vec4 = (x: Node<'vec4'>) => x.sub(floor(x.mul(1 / 289)).mul(289));

const permute = (x: Node<'vec4'>) => mod289_vec4(x.mul(34).add(1).mul(x));

const taylor_inv_sqrt = (r: Node<'vec4'>) => vec4(1.79284291400159).sub(r.mul(0.85373472095314));

export const snoise = Fn(([v]: [Node<'vec3'>]) =>
{
  const C = vec2(1 / 6, 1 / 3);
  const D = vec4(0, 0.5, 1, 2);

  // First corner
  const i = floor(v.add(dot(v, C.yyy)));
  const x0 = v.sub(i).add(dot(i, C.xxx));

  // Other corners
  const g = step(x0.yzx, x0.xyz);
  const l = vec3(1).sub(g);
  const i1 = min(g.xyz, l.zxy);
  const i2 = max(g.xyz, l.zxy);

  const x1 = x0.sub(i1).add(C.xxx);
  const x2 = x0.sub(i2).add(C.yyy); // 2.0 * C.x = 1/3 = C.y
  const x3 = x0.sub(D.yyy);         // -1.0 + 3.0 * C.x = -0.5 = -D.y

  // Permutations
  const im = mod289_vec3(i);
  const p = permute(permute(permute(
    vec4(0, i1.z, i2.z, 1).add(im.z))
    .add(vec4(0, i1.y, i2.y, 1)).add(im.y))
    .add(vec4(0, i1.x, i2.x, 1)).add(im.x));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  const n_ = float(0.142857142857); // 1.0 / 7.0
  const ns = D.wyz.mul(n_).sub(D.xzx);

  const j = p.sub(floor(p.mul(ns.z).mul(ns.z)).mul(49)); // mod(p, 7 * 7)

  const x_ = floor(j.mul(ns.z));
  const y_ = floor(j.sub(x_.mul(7))); // mod(j, N)

  const x = x_.mul(ns.x).add(ns.yyyy);
  const y = y_.mul(ns.x).add(ns.yyyy);
  const h = vec4(1).sub(abs(x)).sub(abs(y));

  const b0 = vec4(x.xy, y.xy);
  const b1 = vec4(x.zw, y.zw);

  const s0 = floor(b0).mul(2).add(1);
  const s1 = floor(b1).mul(2).add(1);
  const sh = step(h, vec4(0)).mul(-1);

  const a0 = b0.xzyw.add(s0.xzyw.mul(sh.xxyy));
  const a1 = b1.xzyw.add(s1.xzyw.mul(sh.zzww));

  // Normalise gradients
  const p0 = vec3(a0.xy, h.x);
  const p1 = vec3(a0.zw, h.y);
  const p2 = vec3(a1.xy, h.z);
  const p3 = vec3(a1.zw, h.w);

  const norm = taylor_inv_sqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));

  // Mix final noise value
  const m = max(vec4(0.6).sub(vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3))), 0);
  const m2 = m.mul(m);

  return dot(m2.mul(m2), vec4(
    dot(p0.mul(norm.x), x0),
    dot(p1.mul(norm.y), x1),
    dot(p2.mul(norm.z), x2),
    dot(p3.mul(norm.w), x3)
  )).mul(42);
}).setLayout({
  name: 'snoise',
  type: 'float',
  inputs: [{ name: 'v', type: 'vec3' }]
});

export const snoise_vec3 = Fn(([x]: [Node<'vec3'>]) =>
{
  const s0 = snoise(x);
  const s1 = snoise(vec3(x.y.sub(19.1), x.z.add(33.4), x.x.add(47.2)));
  const s2 = snoise(vec3(x.z.add(74.2), x.x.sub(124.5), x.y.add(99.4)));

  return vec3(s0, s1, s2);
}).setLayout({
  name: 'snoise_vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }]
});

export const curl_noise = Fn(([p]: [Node<'vec3'>]) =>
{
  const e = 0.1;
  const dx = vec3(e, 0, 0);
  const dy = vec3(0, e, 0);
  const dz = vec3(0, 0, e);

  const p_x0 = snoise_vec3(p.sub(dx));
  const p_x1 = snoise_vec3(p.add(dx));
  const p_y0 = snoise_vec3(p.sub(dy));
  const p_y1 = snoise_vec3(p.add(dy));
  const p_z0 = snoise_vec3(p.sub(dz));
  const p_z1 = snoise_vec3(p.add(dz));

  const x = p_y1.z.sub(p_y0.z).sub(p_z1.y).add(p_z0.y);
  const y = p_z1.x.sub(p_z0.x).sub(p_x1.z).add(p_x0.z);
  const z = p_x1.y.sub(p_x0.y).sub(p_y1.x).add(p_y0.x);

  return normalize(vec3(x, y, z).mul(1 / (2 * e)));
}).setLayout({
  name: 'curl_noise',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec3' }]
});
