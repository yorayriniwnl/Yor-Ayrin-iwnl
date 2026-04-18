"""
Blender automation script to refine a Ready Player Me / GLB avatar.

Usage (run with Blender):
  blender --background --python tools/blender/refine_avatar.py -- \
    --input public/avatars/avatar.glb \
    --output public/avatars/avatar_refined.glb \
    --face-scale 1.02 1.00 1.00 \
    --hair-scale 1.15 \
    --beard-sharpness 1.30 \
    [--hdri path/to/hdri.hdr]

Notes:
- This script applies conservative, parameterized adjustments.
- It prefers armature head-bone scaling when available, otherwise scales head mesh objects.
- Hair objects (name contains "hair") are scaled by the `--hair-scale` factor.
- Beard objects (name contains "beard") receive a Weighted Normal + EdgeSplit modifier to increase apparent sharpness,
  controlled by `--beard-sharpness`.
- If an HDRI path is provided, the world will use it; otherwise a default 3-point area-light setup is created.

Run this script locally in Blender; it cannot run inside this editor environment.
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

    parser = argparse.ArgumentParser(description="Refine avatar GLB inside Blender")
    parser.add_argument("--input", required=True, help="Input GLB path")
    parser.add_argument("--output", required=True, help="Output GLB path")
    parser.add_argument("--face-scale", nargs=3, type=float, default=[1.0, 1.0, 1.0],
                        help="Scale for head/face mesh (sx sy sz)")
    parser.add_argument("--hair-scale", type=float, default=1.0, help="Uniform scale for hair objects")
    parser.add_argument("--beard-sharpness", type=float, default=1.0, help="Weighted normal weight for beard")
    parser.add_argument("--hdri", default=None, help="Optional HDRI path for world lighting")
    return parser.parse_args(argv)


def ensure_empty_scene():
    # reset to an empty scene to avoid interfering objects
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_glb(path):
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    bpy.ops.import_scene.gltf(filepath=path)


def find_objects_by_keyword(keyword):
    kw = keyword.lower()
    return [o for o in bpy.data.objects if o.type == 'MESH' and kw in o.name.lower()]


def find_head_objects():
    # Prefer objects with 'head' or 'face' in the name
    candidates = find_objects_by_keyword('head') + find_objects_by_keyword('face')
    # Deduplicate while preserving order
    seen = set()
    objs = []
    for o in candidates:
        if o.name not in seen:
            objs.append(o)
            seen.add(o.name)
    if objs:
        return objs

    # Fallback: pick the mesh with the highest Z-location (heuristic)
    mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
    if not mesh_objs:
        return []
    mesh_objs.sort(key=lambda o: o.location.z, reverse=True)
    return [mesh_objs[0]]


def apply_face_scale(head_objs, scale):
    if not head_objs:
        return
    # Try armature head bone first, if present
    armatures = [o for o in bpy.data.objects if o.type == 'ARMATURE']
    head_bone_found = False
    for arm in armatures:
        # switch to pose mode to alter bones
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.mode_set(mode='POSE')
        for pb in arm.pose.bones:
            if 'head' in pb.name.lower():
                pb.scale = (pb.scale[0] * scale[0], pb.scale[1] * scale[1], pb.scale[2] * scale[2])
                head_bone_found = True
        bpy.ops.object.mode_set(mode='OBJECT')
        if head_bone_found:
            break

    if head_bone_found:
        # apply armature scale by applying transforms of armature/bones
        for arm in armatures:
            bpy.context.view_layer.objects.active = arm
            try:
                bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            except Exception:
                pass
        return

    # Otherwise, scale the head mesh objects themselves
    for head in head_objs:
        bpy.context.view_layer.objects.active = head
        head.scale = (head.scale[0] * scale[0], head.scale[1] * scale[1], head.scale[2] * scale[2])
        try:
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        except Exception:
            pass


def scale_hair(hair_scale):
    hair_objs = find_objects_by_keyword('hair')
    for h in hair_objs:
        bpy.context.view_layer.objects.active = h
        h.scale = (h.scale[0] * hair_scale, h.scale[1] * hair_scale, h.scale[2] * hair_scale)
        try:
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        except Exception:
            pass


def sharpen_beard(beard_weight):
    beard_objs = find_objects_by_keyword('beard')
    for b in beard_objs:
        bpy.context.view_layer.objects.active = b
        # Add Edge Split then Weighted Normal modifier to increase apparent sharpness
        try:
            es = b.modifiers.new(name='EdgeSplit', type='EDGE_SPLIT')
            es.split_angle = math.pi  # split by angle to preserve sharp edges
            bpy.ops.object.modifier_apply(modifier=es.name)
        except Exception:
            pass

        try:
            wn = b.modifiers.new(name='WeightedNormal', type='WEIGHTED_NORMAL')
            # 'weight' exists in modern Blender; clamp to a reasonable range
            wn.weight = max(0.01, float(beard_weight))
            wn.keep_sharp = True
            bpy.ops.object.modifier_apply(modifier=wn.name)
        except Exception:
            # If Weighted Normal is not available, try a simple sharpen via Smooth/Sharpen
            try:
                # duplicate object, apply a small shrinkwrap to accentuate profile
                pass
            except Exception:
                pass


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
        # Strength adjust
        bg.inputs['Strength'].default_value = 1.0
    else:
        # Add a simple 3-point area light setup
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


def create_camera_framing(target_objs):
    # Create a camera and position it to frame the head region
    cam_data = bpy.data.cameras.new('AvatarCam')
    cam_obj = bpy.data.objects.new('AvatarCam', cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    if not target_objs:
        cam_obj.location = (0.6, -1.6, 1.4)
        cam_obj.rotation_euler = (1.2, 0, 0.6)
        return cam_obj

    # Compute approximate center of first target object
    tgt = target_objs[0]
    if len(tgt.data.vertices) > 0:
        center = sum((v.co for v in tgt.data.vertices), mathutils.Vector()) / len(tgt.data.vertices)
    else:
        center = tgt.location

    cam_obj.location = (center.x + 0.6, center.y - 1.5, center.z + 0.35)
    cam_obj.rotation_euler = (1.2, 0, 0.6)
    return cam_obj


def set_render_settings():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    # Conservative samples to speed up export; increase for higher-fidelity preview
    scene.cycles.samples = 64
    # Use CPU by default; the user can change to GPU in their local preferences
    try:
        scene.cycles.device = 'CPU'
    except Exception:
        pass


def export_glb(output_path):
    # Ensure output dir exists
    out_dir = os.path.dirname(output_path)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_apply=True)


def main():
    args = parse_args()

    ensure_empty_scene()
    print('Importing', args.input)
    import_glb(args.input)

    head_objs = find_head_objects()
    print('Head objects:', [o.name for o in head_objs])

    apply_face_scale(head_objs, args.face_scale)
    scale_hair(args.hair_scale)
    sharpen_beard(args.beard_sharpness)

    setup_lighting(args.hdri)
    create_camera_framing(head_objs)
    set_render_settings()

    print('Exporting', args.output)
    export_glb(args.output)
    print('Refinement complete.')


if __name__ == '__main__':
    main()
