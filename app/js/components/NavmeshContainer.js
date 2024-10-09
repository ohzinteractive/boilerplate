import { NavMeshQuery } from '@recast-navigation/core';

import { threeToSoloNavMesh, NavMeshHelper } from '@recast-navigation/three';
import { CameraManager, ResourceContainer } from 'ohzi-core';
import { BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Raycaster, Vector3 } from 'three';
import { Input } from './Input';

export class NavmeshContainer extends Object3D
{
  constructor()
  {
    super();

    const mesh = ResourceContainer.get('navmesh').scene.children[0];

    const { success, navMesh } = threeToSoloNavMesh([mesh], {
      borderSize: 0,
      cs: 0.2,
      ch: 0.01
    });

    // console.log(success, navMesh);
    this.navMeshHelper = new NavMeshHelper({ navMesh });
    this.navMeshHelper.children[0].material = new MeshBasicMaterial({ color: '#ff0000', transparent: true, opacity: 0.3 });
    this.add(this.navMeshHelper);

    // // compute a path
    // const start = { x: -4, y: 0, z: -4 };
    // const end = { x: 4, y: 0, z: 4 };

    this.navMeshQuery = new NavMeshQuery(navMesh);
    // const { path } = navMeshQuery.computePath(start, end);
    // // const { point: closestPoint } = navMeshQuery.findClosestPoint({ x: 2, y: 1, z: 2 });

    this.startMarker = new Mesh(
      new BoxGeometry(0.1, 0.1, 0.1),
      new MeshBasicMaterial({ color: 'blue' })
    );
    // startMarker.position.set(start.x, start.y + 0.1, start.z);
    this.add(this.startMarker);

    // const endMarker = new Mesh(
    //   new BoxGeometry(0.1, 0.1, 0.1),
    //   new MeshBasicMaterial({ color: 'green' })
    // );
    // endMarker.position.set(end.x, end.y + 0.1, end.z);
    // this.add(endMarker);

    const line = new Line(
      new BufferGeometry(),
      new LineBasicMaterial({ color: 'blue' })
    );
    // line.position.y += 0.1;
    this.add(line);
    this.line = line;

    this.from_point = undefined;
  }

  update()
  {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(Input.NDC, CameraManager.current);

    const intersects = raycaster.intersectObject(this.navMeshHelper);

    if (Input.left_mouse_button_pressed && intersects.length > 0)
    {
      console.log('asldkjasldkj');
      if (this.from_point)
      {
        const result = this.navMeshQuery.findClosestPoint(intersects[0].point);
        const to_point = result.point;

        const { path } = this.navMeshQuery.computePath(this.from_point, to_point);
        this.line.geometry.setFromPoints(path.map(({ x, y, z }) => new Vector3(x, y, z)));
        this.from_point.copy(to_point);
      }
      else
      {
        const result = this.navMeshQuery.findClosestPoint(intersects[0].point);

        this.from_point = new Vector3().copy(result.point);
        this.startMarker.position.copy(result.point);
      }

      // const result = this.navMeshQuery.findClosestPoint(intersects[0].point);

      // this.startMarker.position.copy(result.point);
      // console.log(result.point)
      // const { path } = navMeshQuery.computePath(start, end);
    }
    // this.debugDrawer.reset();
    // this.debugDrawer.drawNavMesh(this.navMesh);

    this.navMeshHelper.update();
  }
}
