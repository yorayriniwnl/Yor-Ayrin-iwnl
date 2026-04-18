Place Mixamo exported FBX files here (example: myAvatar_mixamo.fbx).
After placing the FBX, run:

blender --background --python tools/blender/mixamo_to_glb.py -- --input public/avatars/mixamo/myAvatar_mixamo.fbx --output public/avatars/avatar_animated.glb

Then optionally run `gltf-transform` to optimize for the web.
