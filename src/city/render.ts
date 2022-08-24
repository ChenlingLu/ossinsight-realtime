/*
 * Copyright [yyyy] [name of copyright owner]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BuildingTileType, RoadTileType, TileType } from "./algo";
import { Group, MathUtils, Object3D, Scene, Vector3 } from "three";
import { FLOOR_HEIGHT, GRASS_ASSET, ROAD_TYPES, TREES_SMALL } from "./constants";
import { setShadow } from "@/engine/shadow";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const renderShiftX = -26;
export const renderShiftY = -4;
export const renderShiftZ = 0.38;

export function renderTiles(scene: Scene, loader: GLTFLoader, tileTypes: TileType[][], interactables: Set<Object3D>) {
  const buildings: Group[][] = tileTypes.map(() => []);
  // Render city
  for (let i = 0; i < tileTypes.length; i++) {
    for (let j = 0; j < tileTypes[0].length; j++) {
      const tileType = tileTypes[i][j];
      const x = 2 * (j + renderShiftX) * 1.1;
      const z = 2 * (i + renderShiftY) * 1.1;
      if (tileType.tile === 0) {
        // Render grass tiles
        buildings[i][j] = renderGrass(new Vector3(x, 0, z), scene, loader, interactables);
      } else if (tileType.tile === 1) {
        // Render road tiles
        buildings[i][j] = renderRoad(new Vector3(x, -0.015, z), tileType, scene, loader, interactables);
      } else if (tileType.tile === 2) {
        // Render building tiles
        buildings[i][j] = renderBuilding(new Vector3(x, 2 * renderShiftZ, z), tileType, scene, loader, interactables);
      }
    }
  }

  return buildings;
}

function renderBuilding(
  position: Vector3,
  building: BuildingTileType,
  scene: Scene,
  loader: GLTFLoader,
  interactables: Set<Object3D>,
) {
  const height = Math.min(Math.floor(building.value), 35); // Cap height
  const realHeight = building.value;
  const group = new Group();
  group.name = "BuildingGroup";
  for (let i = 0; i < height; i++) {
    let assetToLoad = "";
    if (i === 0)
      assetToLoad = building.building.groundUrl; // Load ground tile
    else if (i === height - 1)
      assetToLoad = <string>building.building.roofUrl; // Load roof tile
    else assetToLoad = <string>building.building.floorUrl; // Load floor tile
    if (assetToLoad == null || assetToLoad === "") return group;

    loader.load(
      `/models/${assetToLoad}`,
      function (gltf) {
        const isLShaped = building.type === 2;
        let extraShiftZ = 0;
        let extraShiftX = 0;
        if (isLShaped && building.dir === 1) {
          extraShiftZ = 2;
          extraShiftX = 2;
        }
        let extraAngle = 0;

        setShadow(gltf.scene, true, false);

        gltf.scene.name = "Building";
        if (building.mirror) {
          gltf.scene.scale.z *= -1; // mirror the object
          extraAngle = 270; // add extra angle to compensate shift from mirroring
        }

        gltf.scene.position.y = position.y + i * FLOOR_HEIGHT * 2;
        gltf.scene.position.x = position.x + extraShiftX;
        gltf.scene.position.z = position.z + extraShiftZ;

        gltf.scene.rotation.y = MathUtils.degToRad(
          -90 * (building.dir + (isLShaped ? 2 : 0)) - extraAngle,
        );

        group.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );
  }

  group.scale.y = realHeight / height;

  scene.add(group);
  makeInteractable(scene, group, interactables, building.data);

  return group;
}

function renderRoad(
  position: Vector3,
  road: RoadTileType,
  scene: THREE.Scene,
  loader: GLTFLoader,
  interactables: Set<Object3D>,
) {
  const group = new Group();
  group.name = "RoadGroup";

  let assetToLoad = "";
  if (road.type === 0) assetToLoad = ROAD_TYPES[0]; // 2 way road
  else if (road.type === 1) assetToLoad = ROAD_TYPES[1]; // 3 way road
  else if (road.type === 2) assetToLoad = ROAD_TYPES[2]; // 4 way road
  else if (road.type === 3) assetToLoad = ROAD_TYPES[3]; // 2 way turn
  if (assetToLoad == null || assetToLoad === "") return group;

  loader.load(
    `/models/${assetToLoad}`,
    function (gltf) {
      gltf.scene.position.y = position.y;
      gltf.scene.position.x = position.x;
      gltf.scene.position.z = position.z;
      gltf.scene.rotation.y = MathUtils.degToRad(-90 * road.dir);

      setShadow(gltf.scene, false, true);

      gltf.scene.name = "Road";
      group.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  scene.add(group);
  makeInteractable(scene, group, interactables);

  return group;
}

function renderGrass(
  position: Vector3,
  scene: Scene,
  loader: GLTFLoader,
  interactables: Set<Object3D>,
) {
  const group = new Group();
  group.name = "GrassGroup";

  const assetToLoad = GRASS_ASSET;

  loader.load(
    `/models/${assetToLoad}`,
    function (gltf) {
      gltf.scene.position.y = position.y;
      gltf.scene.position.x = position.x;
      gltf.scene.position.z = position.z;

      setShadow(gltf.scene, false, true);

      gltf.scene.name = "Grass";
      group.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Create a tree somewhere on the tile
  for (const i of [-0.7, 0.7]) {
    loader.load(
      `./models/${
        TREES_SMALL[Math.floor(TREES_SMALL.length * Math.random())]
      }`,
      function (gltf) {
        gltf.scene.position.x = position.x + Math.random() * i;
        gltf.scene.position.y = position.y;
        gltf.scene.position.z = position.z + Math.random() * i;

        setShadow(gltf.scene, true, false);

        gltf.scene.name = "Tree";
        group.add(gltf.scene);
      },
    );
  }

  scene.add(group);
  makeInteractable(scene, group, interactables);

  return group;
}

export function makeInteractable(scene: Scene, obj: Object3D, interactables: Set<Object3D>, data?: any) {
  obj.userData.interactable = true;
  interactables.add(obj);

  obj.addEventListener('removed', () => {
    interactables.delete(obj);
  });

  obj.addEventListener('focus', ({ isCurrentBuilding }) => {
    scene.dispatchEvent({
      type: 'focus',
      data,
      isCurrentBuilding,
    });
  });
}
