"use client"

import React from "react";
import ModelViewer from "../3d/ModelViewer";

export default function ModelPreview() {
  return (
    <div style={{ width: 360, height: 360 }}>
      <ModelViewer src="/avatars/avatar.glb" />
    </div>
  );
}
