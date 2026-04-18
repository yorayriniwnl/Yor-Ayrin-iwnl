# Mixamo workflow: upload, animate, download

This doc explains how to upload your avatar to Mixamo, add animations (idle breathing, typing/slight movement), and retrieve a download suitable for the site. It also describes how to convert Mixamo downloads to an animated GLB using Blender (automation helper included).

1) Prepare your avatar
- Place your source avatar at `public/avatars/avatar.glb` in this repo. Mixamo accepts FBX/OBJ uploads best — if Mixamo rejects GLB, export to FBX from Blender first.

2) Upload to Mixamo
- Open https://www.mixamo.com/ and sign in with your Adobe ID.
- Click "Upload Character" and upload your avatar file. If Mixamo asks for a T-pose, follow the UI guidance to align the character.

3) Apply animations
- Search for animations:
  - Idle / breathing: try `Idle`, `Breathe`, or `Idle 1` — use a subtle idle and reduce magnitude.
  - Typing / slight movement: search `Typing`, `Type`, `Sit Typing`, or `Idle Move` for a low-energy, small-amplitude motion.
- Tune animation settings (in Mixamo UI):
  - **Overdrive / Arm Space**: reduce if arms look unnatural.
  - **In/Out**: enable short easing in/out if needed.
  - **FPS**: 30 FPS is fine for web.

4) Download animated file
- Click `Download` and choose:
  - Format: `FBX` (or `FBX for Unity`) — FBX is safe and widely supported by Blender and Three.js exporters.
  - Skin: `With Skin` (so the exported package includes the skinned mesh if you uploaded to Mixamo)
  - Frames per second: `30`
- Save the downloaded file(s) into the repo under `public/avatars/mixamo/` (create this folder and put the .fbx/.zip there).

5) Convert Mixamo export to GLB (Blender helper)
- If you downloaded an FBX containing the animated character, run the included Blender helper to import and export a GLB with animation baked.

Example (Windows):

```powershell
"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe" --background --python tools/blender/mixamo_to_glb.py -- \
  --input public/avatars/mixamo/myAvatar_mixamo.fbx \
  --output public/avatars/avatar_animated.glb \
  --hdri public/assets/hdr/studio.hdr
```

6) (Optional) Optimize for Web
- Use `gltf-transform` to compress textures and apply Draco/quantization:

```bash
npm install -g @gltf-transform/cli
npx @gltf-transform/cli draco public/avatars/avatar_animated.glb public/avatars/avatar_animated_opt.glb --encoder-speed=5
# then inspect and commit the optimized GLB
```

7) Commit the animation to the repo
- When you have `public/avatars/avatar_animated(.opt).glb` in the repo, commit and push with the message:

```bash
git add public/avatars/avatar_animated*.glb
git commit -m "3D: animation added"
git push
```

Notes & troubleshooting
- If Mixamo rejects the upload: export from Blender to `FBX` (binary), with a T-pose and no modifiers applied.
- If animations look offset after import: check armature scale/rotation; Blender `Apply Scale/Rotation` often fixes issues.
- If the avatar has non-standard bone names, Mixamo's auto-rig may create a new skeleton and export will include a skinned mesh. Use that downloaded FBX directly — it's the simplest path.
