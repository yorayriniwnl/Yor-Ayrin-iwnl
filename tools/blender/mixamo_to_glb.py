"""
Blender helper to convert a Mixamo FBX (animated) to a GLB with animation.

Usage (run with Blender):
  blender --background --python tools/blender/mixamo_to_glb.py -- \
    --input public/avatars/mixamo/your_mixamo_export.fbx \
    --output public/avatars/avatar_animated.glb \
    [--hdri public/assets/hdr/studio.hdr]

This script imports the Mixamo FBX/GLB, sets a simple preview lighting/camera, and exports a GLB containing the skinned mesh and animation.
"""

import sys
import os
import argparse

try:
    import bpy
    import mathutils
    import math
except Exception:
    print("This script must be run inside Blender (bpy available). Exiting.")
    sys.exit(1)


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []

    parser = argparse.ArgumentParser(description="Convert Mixamo export to GLB with animation")
    parser.add_argument("--input", required=True, help="Input FBX/GLB path from Mixamo")
    parser.add_argument("--output", required=True, help="Output GLB path")
    parser.add_argument("--hdri", default=None, help="Optional HDRI for lighting preview")
    return parser.parse_args(argv)


def ensure_empty_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_asset(path):
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    ext = os.path.splitext(path)[1].lower()
    if ext == '.fbx':
        bpy.ops.import_scene.fbx(filepath=path, automatic_bone_orientation=True)
    elif ext in ('.glb', '.gltf'):
        bpy.ops.import_scene.gltf(filepath=path)
    else:
        raise RuntimeError('Unsupported extension: ' + ext)


def setup_lighting(hdri_path=None):
    if hdri_path and os.path.exists(hdri_path):
        world = bpy.data.worlds['World']
        world.use_nodes = True
        nodes = world.node_tree.nodes
        links = world.node_tree.links
        nodes.clear()
        tex = nodes.new(type='ShaderNodeTexEnvironment')
        tex.image = bpy.data.images.load(hdri_path)
        bg = nodes.new(type='ShaderNodeBackground')
        out = nodes.new(type='ShaderNodeOutputWorld')
        links.new(tex.outputs['Color'], bg.inputs['Color'])
        links.new(bg.outputs['Background'], out.inputs['Surface'])
        bg.inputs['Strength'].default_value = 1.0
    else:
        # 3-point area lights
        def add_area(name, loc, rot, size, energy):
            light_data = bpy.data.lights.new(name=name, type='AREA')
            light_data.size = size
            light_data.energy = energy
            light_obj = bpy.data.objects.new(name, light_data)
            bpy.context.collection.objects.link(light_obj)
            light_obj.location = loc
            light_obj.rotation_euler = rot
            return light_obj

        add_area('KeyLight', (0.8, -1.2, 1.2), (math.radians(60), 0, math.radians(20)), 0.6, 1200)
        add_area('FillLight', (-0.8, -0.6, 0.8), (math.radians(45), 0, math.radians(-30)), 1.2, 300)
        add_area('RimLight', (0.0, 1.4, 1.0), (math.radians(90), 0, 0), 0.4, 900)


def create_camera():
    cam_data = bpy.data.cameras.new('AvatarCam')
    cam_obj = bpy.data.objects.new('AvatarCam', cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    cam_obj.location = (0.6, -1.6, 1.4)
    cam_obj.rotation_euler = (1.2, 0, 0.6)
    return cam_obj


def export_glb(output_path):
    out_dir = os.path.dirname(output_path)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_apply=True)


def set_scene_frame_from_actions():
    actions = list(bpy.data.actions)
    if not actions:
        return
    # Choose the longest action (heuristic)
    best = max(actions, key=lambda a: (a.frame_range[1] - a.frame_range[0]))
    start, end = int(best.frame_range[0]), int(best.frame_range[1])
    bpy.context.scene.frame_start = max(0, start)
    bpy.context.scene.frame_end = max(start + 1, end)


def main():
    args = parse_args()
    ensure_empty_scene()
    print('Importing:', args.input)
    import_asset(args.input)
    setup_lighting(args.hdri)
    create_camera()
    set_scene_frame_from_actions()
    print('Exporting:', args.output)
    export_glb(args.output)
    print('Done.')


if __name__ == '__main__':
    main()
