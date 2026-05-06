# Blender refinement & export workflow

This document explains how to run the automated Blender script included in the repo to refine a Ready Player Me / GLB avatar, preview with better lighting, and produce an optimized GLB suitable for the site.

Files added:
- `tools/blender/refine_avatar.py` — Blender Python automation script (run inside Blender).

Prerequisites
- Blender (local install) — run the script with Blender's bundled Python: `blender --background --python ...`.
- Node.js (optional) and `@gltf-transform/cli` for post-export optimization if you want Draco/quantization compression.

Steps
1. Place your source GLB in the repo at `public/avatars/avatar.glb`.

2. Run the Blender automation script (example Windows path):

```powershell
"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe" --background --python tools/blender/refine_avatar.py -- \
  --input public/avatars/avatar.glb \
  --output public/avatars/avatar_refined.glb \
  --face-scale 1.02 1.00 1.00 \
  --hair-scale 1.15 \
  --beard-sharpness 1.30 \
  --hdri public/assets/hdr/studio.hdr
```

- `--face-scale` accepts three floats for X/Y/Z local scale for head/face.
- `--hair-scale` is a uniform multiplier for objects with "hair" in their name.
- `--beard-sharpness` controls a Weighted Normal modifier applied to objects named with "beard".
- `--hdri` is optional; if omitted the script creates a 3-point area-light preview.

3. (Optional) Optimize the exported GLB with gltf-transform (recommended for web):

Install CLI and run compression (example):

```bash
npm install -g @gltf-transform/cli
npx @gltf-transform/cli draco public/avatars/avatar_refined.glb public/avatars/avatar_refined_opt.glb --encoder-speed=5
# Additional tools: prune, dedup, texture-resize, quantize
```

4. When satisfied, commit the refined/optimized GLB into the repo and push:

```bash
git add public/avatars/avatar_refined_opt.glb tools/blender/refine_avatar.py docs/BLENDER_REFINE_AVATAR.md
git commit -m "3D: blender refinement"
git push
```

Notes & caveats
- This automation is conservative and heuristic-driven. Manual tweaks in Blender are recommended for best results (topology-aware edits, sculpt, shape-keys, retargeted morphs).
- The script looks for mesh object names containing `head`, `face`, `hair`, and `beard`. If your GLB uses different naming, adjust the script or rename objects before import.
- If your avatar uses particle-hair or complex materials, further manual work may be required.

Need help running it locally?
- If you prefer, I can provide a small PowerShell wrapper or CI job to run the Blender command on your machine, but I'd need remote access or the exported GLB placed into the repo at `public/avatars/avatar.glb`.
