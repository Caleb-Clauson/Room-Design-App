'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Grid, OrbitControls, SoftShadows, TransformControls } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { Mesh, Object3D } from 'three';
import { clampToRoom, collides } from '@/lib/constraints';
import { CATALOG } from '@/lib/catalog';
import type { SceneNode, StructuralNode, TransformMode } from '@/types/app';

type Props = {
  roomBounds: { width: number; depth: number; height: number };
  nodes: SceneNode[];
  structures: StructuralNode[];
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  mode: TransformMode;
  snapping: boolean;
  onNodeTransform: (id: string, pos: [number, number, number], rot: [number, number, number]) => void;
  setObjectPosition: (v: { x: number; y: number; z: number }) => void;
};

export function ViewportCanvas({
  roomBounds,
  nodes,
  structures,
  activeNodeId,
  setActiveNodeId,
  mode,
  snapping,
  onNodeTransform,
  setObjectPosition,
}: Props) {
  const orbitRef = useRef<any>(null);
  const selectionRef = useRef<Object3D | null>(null);
  const islandPosition = useMemo(() => nodes.find((n) => n.assetId === 'asset-k-island')?.position ?? [0, 0.5, 0], [nodes]);

  useEffect(() => {
    if (selectionRef.current && activeNodeId && selectionRef.current.name !== activeNodeId) {
      selectionRef.current = null;
    }
  }, [activeNodeId]);

  return (
    <div className="viewport-shell">
      <div className="viewport-toolbar">
        <span className="text-xs text-app-text">Move <span className="kbd">W</span></span>
        <span className="text-xs text-app-text">Rotate <span className="kbd">E</span></span>
        <span className="text-xs text-app-text">Snap <span className="kbd">S</span></span>
      </div>

      <Canvas shadows camera={{ position: [8, 6, 8], fov: 45 }}>
        <color attach="background" args={['#03050a']} />
        <SoftShadows size={35} focus={0.85} samples={16} />
        <ambientLight intensity={0.35} />
        <directionalLight castShadow position={[8, 11, 6]} intensity={1.4} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <Environment preset="warehouse" />
        <Grid fadeDistance={40} sectionColor="#1a2747" cellColor="#0f1832" infiniteGrid />

        <mesh receiveShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[roomBounds.width, 0.1, roomBounds.depth]} />
          <meshStandardMaterial color="#0e1423" roughness={0.95} metalness={0.05} />
        </mesh>

        {structures.map((wall) => (
          <mesh
            key={wall.id}
            name={wall.id}
            position={wall.position}
            rotation={wall.rotation}
            onClick={(e) => {
              e.stopPropagation();
              setActiveNodeId(wall.id);
              selectionRef.current = e.object;
              setObjectPosition({ x: e.object.position.x, y: e.object.position.y, z: e.object.position.z });
            }}
          >
            <boxGeometry args={wall.size} />
            <meshStandardMaterial color="#1a2339" roughness={0.9} metalness={0.12} />
          </mesh>
        ))}

        {nodes.map((node) => {
          const asset = CATALOG.find((a) => a.id === node.assetId);
          if (!asset) return null;
          const dims = asset.dimensions;
          const geometry =
            asset.shape === 'box' ? (
              <boxGeometry args={[dims.w, dims.h, dims.d]} />
            ) : (
              <cylinderGeometry args={[dims.w / 2, dims.w / 2, dims.h, 24]} />
            );

          return (
            <mesh
              key={node.id}
              name={node.id}
              castShadow
              receiveShadow
              position={node.position}
              rotation={node.rotation}
              onClick={(e) => {
                e.stopPropagation();
                setActiveNodeId(node.id);
                selectionRef.current = e.object;
                setObjectPosition({ x: e.object.position.x, y: e.object.position.y, z: e.object.position.z });
              }}
            >
              {geometry}
              <meshStandardMaterial color={asset.color} metalness={asset.metallic ?? 0.4} roughness={asset.roughness ?? 0.45} />
            </mesh>
          );
        })}

        {activeNodeId && selectionRef.current && (
          <TransformControls
            object={selectionRef.current}
            mode={mode}
            translationSnap={snapping ? 0.25 : undefined}
            rotationSnap={snapping ? Math.PI / 8 : undefined}
            onMouseDown={() => {
              if (orbitRef.current) orbitRef.current.enabled = false;
            }}
            onMouseUp={() => {
              if (orbitRef.current) orbitRef.current.enabled = true;
            }}
            onObjectChange={() => {
              if (!selectionRef.current || !activeNodeId) return;

              const node = nodes.find((n) => n.id === activeNodeId);
              if (!node) {
                setObjectPosition({
                  x: selectionRef.current.position.x,
                  y: selectionRef.current.position.y,
                  z: selectionRef.current.position.z,
                });
                return;
              }

              let nextPos: [number, number, number] = [
                selectionRef.current.position.x,
                selectionRef.current.position.y,
                selectionRef.current.position.z,
              ];

              if (node.lockedTo === 'island') {
                nextPos = [islandPosition[0], islandPosition[1], islandPosition[2]];
              } else if (node.lockedTo === 'wall') {
                nextPos = [-(roomBounds.width / 2) + 0.5, nextPos[1], nextPos[2]];
              }

              nextPos = clampToRoom(nextPos, roomBounds);
              if (collides(node, nextPos, nodes)) {
                nextPos = node.position;
              }

              selectionRef.current.position.set(nextPos[0], nextPos[1], nextPos[2]);
              setObjectPosition({ x: nextPos[0], y: nextPos[1], z: nextPos[2] });

              onNodeTransform(activeNodeId, nextPos, [
                selectionRef.current.rotation.x,
                selectionRef.current.rotation.y,
                selectionRef.current.rotation.z,
              ]);
            }}
          />
        )}

        <OrbitControls ref={orbitRef} makeDefault enableDamping dampingFactor={0.08} minDistance={4} maxDistance={30} />
      </Canvas>
    </div>
  );
}
