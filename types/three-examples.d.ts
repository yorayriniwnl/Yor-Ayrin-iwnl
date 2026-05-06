declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader, LoadingManager } from 'three'
  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager)
    load(url: string, onLoad: (gltf: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void
    parse(data: ArrayBuffer, path: string, onLoad: (gltf: any) => void, onError?: (err: Error) => void): void
  }
  export default GLTFLoader
}

declare module 'three/examples/jsm/utils/BufferGeometryUtils' {
  import { BufferGeometry } from 'three'
  export function mergeBufferGeometries(geometries: BufferGeometry[], useGroups?: boolean): BufferGeometry | null
}

declare module 'three/examples/jsm/utils/SkeletonUtils' {
  export function clone(source: any): any
}

declare module 'three/examples/jsm/*' {
  const whatever: any
  export default whatever
}
