'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, TransformControls, ContactShadows, Grid, PerspectiveCamera } from '@react-three/drei';
import type { PlacedItem } from './ProductCatalog';

export default function RoomCanvas({
  items,
  selectedId,
  snapToGrid,
  onSelect,
  onMove,
  onRotate,
}: {
  items: PlacedItem[];
  selectedId: string | null;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onRotate: (id: string) => void;
}) {
  return (
    <div className="relative aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-xl border border-[#222a38] bg-[#07090e] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* 
        This is a true WebGL 3D Canvas. 
        It calculates real lighting, perspective, and depth.
      */}
      <Canvas shadows>
        {/* Camera Setup */}
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
        
        {/* Environment & Lighting (Creates the photorealistic reflections/lighting) */}
        <Environment preset="city" environmentIntensity={0.5} />
        <ambientLight intensity={0.3} />
        <directionalLight 
          castShadow 
          position={[5, 5, 5]} 
          intensity={1} 
          shadow-mapSize={[1024, 1024]}
        />

        {/* The 3D Floor/Grid */}
        <Grid 
          renderOrder={-1} 
          position={[0, 0, 0]} 
          infiniteGrid 
          fadeDistance={10} 
          fadeStrength={5} 
          cellSize={snapToGrid ? 0.5 : 0.1} 
          sectionSize={1} 
          sectionColor="#334155" 
          cellColor="#1e293b" 
        />
        
        {/* Invisible floor plane to catch realistic shadows */}
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />

        {/* 
          Render Spatial Objects.
          In a production app, these would load actual .glb / .gltf 3D models.
          For now, we render real 3D geometry scaled to the product's actual dimensions.
        */}
        <Suspense fallback={null}>
          {items.map((item) => {
            // Convert inches to meters for 3D scale (approximate)
            const w = item.width * 0.0254;
            const h = (item.height || 32) * 0.0254; 
            const d = (item.depth || item.width) * 0.0254;

            const isSelected = selectedId === item.id;

            return (
              <TransformControls
                key={item.id}
                showX={isSelected}
                showY={false} // Lock to floor for furniture
                showZ={isSelected}
                mode="translate"
                translationSnap={snapToGrid ? 0.25 : null}
                position={[(item.x - 50) / 10, h / 2, (item.y - 50) / 10]}
                onMouseUp={(e) => {
                  // Capture new position when user drops the object
                  if (e.target && e.target.object) {
                    const pos = e.target.object.position;
                    onMove(item.id, pos.x * 10 + 50, pos.z * 10 + 50);
                  }
                }}
              >
                <mesh 
                  castShadow 
                  receiveShadow 
                  onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
                >
                  <boxGeometry args={[w, h, d]} />
                  <meshStandardMaterial 
                    color={isSelected ? "#06b6d4" : "#475569"} 
                    roughness={0.2}
                    metalness={0.1}
                  />
                </mesh>
              </TransformControls>
            );
          })}
        </Suspense>
      </Canvas>

      {/* Viewport UI Overlay */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[11px] font-mono text-slate-300 pointer-events-none">
        WebGL Rendering • PBR Materials Active
      </div>
    </div>
  );
}