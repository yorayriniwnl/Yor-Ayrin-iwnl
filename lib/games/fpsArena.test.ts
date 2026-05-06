import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import {
  ARENA_BOXES,
  ENEMY_SPAWNS,
  lineBlockedByCover,
  pickSpawnPoint,
  rayBoxDistance,
  raySphereDistance,
} from './fpsArena'

describe('fpsArena helpers', () => {
  it('returns the nearest sphere hit distance', () => {
    const distance = raySphereDistance(
      new THREE.Vector3(0, 1.6, 0),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 1.6, -5),
      1,
    )

    expect(distance).not.toBeNull()
    expect(distance).toBeCloseTo(4)
  })

  it('detects ray intersections against cover boxes', () => {
    const box = ARENA_BOXES[0]
    const distance = rayBoxDistance(
      new THREE.Vector3(box.x, 1.2, box.z + 5),
      new THREE.Vector3(0, 0, -1),
      box,
    )

    expect(distance).not.toBeNull()
    expect(distance).toBeGreaterThan(0)
  })

  it('reports blocked sightlines when cover sits between two points', () => {
    const box = ARENA_BOXES[0]
    const blocked = lineBlockedByCover(
      new THREE.Vector3(box.x, 1.4, box.z + 5),
      new THREE.Vector3(box.x, 1.4, box.z - 5),
    )

    expect(blocked).toBe(true)
  })

  it('picks a spawn point far from the player', () => {
    const playerPosition = new THREE.Vector3(ENEMY_SPAWNS[0].x, 0, ENEMY_SPAWNS[0].z)
    const spawn = pickSpawnPoint(playerPosition, 2)

    expect(spawn).not.toEqual(ENEMY_SPAWNS[0])
  })
})
