Ready Player Me — Create avatar from a reference photo
---------------------------------------------------

Follow these steps to create a semi-realistic Ready Player Me avatar from your face photo and export a GLB that will be automatically used by the site when placed at `public/avatars/avatar.glb`.

1) Prepare the photo
   - Crop the image to a front-facing headshot (square or portrait), with eyes roughly centered horizontally.
   - Save as `face.jpg` (JPEG) at full resolution (recommended 1024–2048px short edge).

2) Open Ready Player Me
   - In your browser go to: https://readyplayer.me/
   - Click "Create Avatar" → choose "Avatar for Web" (or the appropriate option).

3) Upload your photo
   - Use the uploader to provide `face.jpg`.
   - Let the tool analyze the face.

4) Adjust appearance
   - Choose a semi-realistic style or the closest available (avoid extreme cartoony presets).
   - Hair: select "medium" length (or choose the closest style); tweak color to match.
   - Facial hair: choose a light beard / stubble option.
   - Skin tone: pick the closest match from the palette.

5) Export GLB
   - When satisfied, export/download the avatar as a GLB (glTF Binary).
   - Save the downloaded file as `avatar.glb`.

6) Add to the project
   - Place `avatar.glb` into the repo at `public/avatars/avatar.glb`.
   - Commit & push: `git add public/avatars/avatar.glb && git commit -m "3D: avatar base from Ready Player Me" && git push`

Notes
   - The site already detects `public/avatars/avatar.glb` and will load it automatically in the hero when present.
   - If you'd like, attach `avatar.glb` here and I will add it to the repo, commit with the message above, and verify the in-site preview.
