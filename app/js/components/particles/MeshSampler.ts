import type { BufferGeometry } from 'three';
import { Triangle, Vector3 } from 'three';

export interface SampledShape
{
  count: number;
  positions: Float32Array; // count * 3
  colors: Float32Array;    // count * 3, white when the geometry has no color attribute
}

// Keeps the faces it returns true for, given the face normal
export type FaceFilter = (normal: Vector3) => boolean;

// Samples points uniformly over the surface of one or more geometries.
// Faces are picked with probability proportional to their area (cumulative
// distribution + binary search), so tiny and huge triangles can coexist.
class MeshSampler
{
  tmp_a: Vector3;
  tmp_b: Vector3;
  tmp_c: Vector3;
  tmp_triangle: Triangle;
  tmp_normal: Vector3;

  constructor()
  {
    this.tmp_a = new Vector3();
    this.tmp_b = new Vector3();
    this.tmp_c = new Vector3();
    this.tmp_triangle = new Triangle(this.tmp_a, this.tmp_b, this.tmp_c);
    this.tmp_normal = new Vector3();
  }

  get_area(geometries: BufferGeometry[], face_filter?: FaceFilter)
  {
    let area = 0;

    for (let i = 0; i < geometries.length; i++)
    {
      const geometry = geometries[i];
      const face_count = this.get_face_count(geometry);

      for (let f = 0; f < face_count; f++)
      {
        if (this.accepts_face(geometry, f, face_filter))
        {
          area += this.get_face_area(geometry, f);
        }
      }
    }

    return area;
  }

  sample(geometries: BufferGeometry[], count: number, face_filter?: FaceFilter): SampledShape
  {
    const faces: { geometry: BufferGeometry; face: number }[] = [];
    const cumulative_areas: number[] = [];
    let total_area = 0;

    for (let i = 0; i < geometries.length; i++)
    {
      const geometry = geometries[i];
      const face_count = this.get_face_count(geometry);

      for (let f = 0; f < face_count; f++)
      {
        if (!this.accepts_face(geometry, f, face_filter))
        {
          continue;
        }

        total_area += this.get_face_area(geometry, f);

        faces.push({ geometry, face: f });
        cumulative_areas.push(total_area);
      }
    }

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++)
    {
      const { geometry, face } = faces[this.find_face(cumulative_areas, Math.random() * total_area)];

      let w1 = Math.random();
      let w2 = Math.random();

      if (w1 + w2 > 1)
      {
        w1 = 1 - w1;
        w2 = 1 - w2;
      }

      const w3 = 1 - (w1 + w2);

      const [i0, i1, i2] = this.get_face_indices(geometry, face);

      this.interpolate(geometry.getAttribute('position'), i0, i1, i2, w1, w2, w3, positions, i);

      const color = geometry.getAttribute('color');

      if (color)
      {
        this.interpolate(color, i0, i1, i2, w1, w2, w3, colors, i);
      }
      else
      {
        colors.fill(1, i * 3, i * 3 + 3);
      }
    }

    return { count, positions, colors };
  }

  find_face(cumulative_areas: number[], value: number)
  {
    let low = 0;
    let high = cumulative_areas.length - 1;

    while (low < high)
    {
      const mid = (low + high) >> 1;

      if (cumulative_areas[mid] < value)
      {
        low = mid + 1;
      }
      else
      {
        high = mid;
      }
    }

    return low;
  }

  interpolate(attribute: any, i0: number, i1: number, i2: number, w1: number, w2: number, w3: number, out: Float32Array, out_index: number)
  {
    out[out_index * 3 + 0] = attribute.getX(i0) * w1 + attribute.getX(i1) * w2 + attribute.getX(i2) * w3;
    out[out_index * 3 + 1] = attribute.getY(i0) * w1 + attribute.getY(i1) * w2 + attribute.getY(i2) * w3;
    out[out_index * 3 + 2] = attribute.getZ(i0) * w1 + attribute.getZ(i1) * w2 + attribute.getZ(i2) * w3;
  }

  get_face_count(geometry: BufferGeometry)
  {
    const count = geometry.index ? geometry.index.count : geometry.getAttribute('position').count;

    return Math.floor(count / 3);
  }

  get_face_indices(geometry: BufferGeometry, face: number)
  {
    if (geometry.index)
    {
      const index = geometry.index;

      return [index.getX(face * 3 + 0), index.getX(face * 3 + 1), index.getX(face * 3 + 2)];
    }

    return [face * 3 + 0, face * 3 + 1, face * 3 + 2];
  }

  accepts_face(geometry: BufferGeometry, face: number, face_filter?: FaceFilter)
  {
    if (!face_filter)
    {
      return true;
    }

    this.set_triangle(geometry, face);

    return face_filter(this.tmp_triangle.getNormal(this.tmp_normal));
  }

  get_face_area(geometry: BufferGeometry, face: number)
  {
    this.set_triangle(geometry, face);

    return this.tmp_triangle.getArea();
  }

  set_triangle(geometry: BufferGeometry, face: number)
  {
    const position = geometry.getAttribute('position');
    const [i0, i1, i2] = this.get_face_indices(geometry, face);

    this.tmp_a.fromBufferAttribute(position, i0);
    this.tmp_b.fromBufferAttribute(position, i1);
    this.tmp_c.fromBufferAttribute(position, i2);
  }
}

const mesh_sampler = new MeshSampler();
export { mesh_sampler as MeshSampler };
