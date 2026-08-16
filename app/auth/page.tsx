'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, TransformControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- TYPES ---
type TransformMode = 'translate' | 'rotate';

type SceneAsset = {
  id: string;
  name: string;
  category: string;
  hexColor: string;
  dimensions: { w: number; h: number; d: number };
  shape: 'box' | 'cylinder';
  collisionLock?: 'island' | 'wall' | null;
};

type SceneNode = {
  id: string;
  assetId: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

type StructuralNode = {
  id: string;
  type: 'wall' | 'window' | 'door';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
};

// --- PREMIUM CATALOG ---
const CATALOG: SceneAsset[] = [
  { id: 'asset-k-island', name: 'Arc Quartz Island', dimensions: { w: 3, h: 1, d: 1.2 }, hexColor: '#e5e7eb', shape: 'box', category: 'Kitchen' },
  { id: 'asset-k-stove', name: 'Chefline Pro Stove', dimensions: { w: 0.9, h: 0.9, d: 0.6 }, hexColor: '#111111', shape: 'box', category: 'Kitchen', collisionLock: 'island' },
  { id: 'asset-k-fridge', name: 'Nordic French Door Fridge', dimensions: { w: 0.9, h: 1.8, d: 0.8 }, hexColor: '#888888', shape: 'box', category: 'Kitchen', collisionLock: 'wall' },
  { id: 'asset-floral-arrangement', name: 'Signature Floral Arrangement', dimensions: { w: 0.4, h: 0.5, d: 0.4 }, hexColor: '#d4a373', shape: 'cylinder', category: 'Decor' },
  { id: 'asset-l-washer', name: 'High-Efficiency Washer', dimensions: { w: 0.7, h: 0.9, d: 0.7 }, hexColor: '#ffffff', shape: 'box', category: 'Laundry' },
  { id: 'asset-o-desk', name: 'Executive Standing Desk', dimensions: { w: 1.6, h: 0.75, d: 0.8 }, hexColor: '#4a3b32', shape: 'box', category: 'Office' },
];

const DEFAULT_STRUCTURES: StructuralNode[] = [
  { id: 'wall-back', type: 'wall', name: 'Back Solid Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
  { id: 'wall-left', type: 'wall', name: 'Left Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
];

const DEFAULT_NODES: SceneNode[] = [
  { id: 'node-island', assetId: 'asset-k-island', name: 'Arc Quartz Island', position: [0, 0.5, 0], rotation: [0, 0, 0] },
  { id: 'node-stove', assetId: 'asset-k-stove', name: 'Chefline Pro Stove', position: [0, 0.9, 0], rotation: [0, 0, 0] },
];

// --- 3D CANVAS COMPONENT ---
function ViewportCanvas({ nodes, structures, activeNodeId, setActiveNodeId, mode, snapping, onNodeTransform, setObjectPosition }: any) {
  const { scene } = useThree();
  const orbitRef = useRef<any>(null);
  const [target, setTarget] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (activeNodeId) {
      const obj = scene.getObjectByName(activeNodeId);
      if (obj) setTarget(obj);
    } else setTarget(null);
  }, [activeNodeId, scene]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <Environment preset="city" />
      
      {/* Immersive fade grid */}
      <Grid infiniteGrid fadeDistance={50} sectionColor="#444" cellColor="#222" position={[0, -0.01, 0]} />

      {structures.map((arch: StructuralNode) => (
        <mesh key={arch.id} name={arch.id} position={arch.position} rotation={arch.rotation} receiveShadow
          onClick={(e) => { e.stopPropagation(); setActiveNodeId(arch.id); setTarget(e.object); }}>
          <boxGeometry args={arch.size} />
          <meshStandardMaterial color="#1a1c23" roughness={0.7} />
        </mesh>
      ))}

      {nodes.map((node: SceneNode) => {
        const asset = CATALOG.find(a => a.id === node.assetId);
        if (!asset) return null;
        return (
          <mesh key={node.id} name={node.id} position={node.position} rotation={node.rotation} castShadow receiveShadow
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(node.id); setTarget(e.object); }}>
            {asset.shape === 'box' ? <boxGeometry args={[asset.dimensions.w, asset.dimensions.h, asset.dimensions.d]} /> : <cylinderGeometry args={[asset.dimensions.w, asset.dimensions.w, asset.dimensions.h, 32]} />}
            <meshStandardMaterial color={asset.hexColor} roughness={0.3} metalness={0.6} />
          </mesh>
        );
      })}

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />

      {target && (
        <TransformControls object={target} mode={mode} translationSnap={snapping ? 0.25 : null} rotationSnap={snapping ? Math.PI / 4 : null}
          onChange={() => setObjectPosition({ x: target.position.x, y: target.position.y, z: target.position.z })}
          onMouseDown={() => { if (orbitRef.current) orbitRef.current.enabled = false; }}
          onMouseUp={() => { if (orbitRef.current) orbitRef.current.enabled = true; onNodeTransform(activeNodeId, target.position, target.rotation); }}
        />
      )}
      <OrbitControls ref={orbitRef} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

// --- MAIN APPLICATION LAYOUT ---
export default function HomePage() {
  const [projectName, setProjectName] = useState('Premium Concept Design');
  const [structures, setStructures] = useState<StructuralNode[]>(DEFAULT_STRUCTURES);
  const [nodes, setNodes] = useState<SceneNode[]>(DEFAULT_NODES);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [gizmoMode, setGizmoMode] = useState<TransformMode>('translate');
  const [snapping, setSnapping] = useState(true);
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0.5, z: 0 });

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoadingState, setAiLoadingState] = useState('');

  const selectedNode = nodes.find((n) => n.id === activeNodeId) ?? null;
  const selectedAsset = selectedNode ? CATALOG.find((a) => a.id === selectedNode.assetId) ?? null : null;

  function updateNodeTransform(id: string, pos: [number, number, number], rot: [number, number, number]) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position: pos, rotation: rot } : n)));
    setStructures((prev) => prev.map((s) => (s.id === id ? { ...s, position: pos, rotation: rot } : s)));
  }

  function addAsset(asset: SceneAsset) {
    const id = `node-${Date.now()}`;
    const node: SceneNode = { id, assetId: asset.id, name: asset.name, position: [0, asset.dimensions.h / 2, 0], rotation: [0, 0, 0] };
    setNodes((prev) => [...prev, node]);
    setActiveNodeId(id);
  }

  const handleImageUpload = () => {
    setAiLoadingState('Maintaining strict room dimensions...');
    setTimeout(() => setAiLoadingState('Ensuring no windows are placed on back wall...'), 1500);
    setTimeout(() => setAiLoadingState('Restoring stove to island and fridge along wall...'), 3000);
    setTimeout(() => {
      setNodes([
        { id: 'node-island', assetId: 'asset-k-island', name: 'Arc Quartz Island', position: [0, 0.5, 0], rotation: [0, 0, 0] },
        { id: 'node-stove', assetId: 'asset-k-stove', name: 'Chefline Pro Stove', position: [0, 0.9, 0], rotation: [0, 0, 0] },
        { id: 'node-fridge', assetId: 'asset-k-fridge', name: 'Nordic French Door Fridge', position: [-4.5, 0.92, -2.5], rotation: [0, 0, 0] },
        { id: 'node-floral', assetId: 'asset-floral-arrangement', name: 'Signature Floral Arrangement', position: [1.2, 0.25, 0], rotation: [0, 0, 0] },
      ]);
      setAiLoadingState('');
      setAiModalOpen(false);
    }, 4500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') setGizmoMode('translate');
      if (key === 'e') setGizmoMode('rotate');
      if (key === 's') setSnapping((v) => !v);
      if ((key === 'delete' || key === 'backspace') && activeNodeId) {
        setNodes((prev) => prev.filter((n) => n.id !== activeNodeId));
        setStructures((prev) => prev.filter((n) => n.id !== activeNodeId));
        setActiveNodeId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeNodeId]);

  return (
    <main className="workspace-shell">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [8, 8, 12], fov: 45 }}>
          <ViewportCanvas nodes={nodes} structures={structures} activeNodeId={activeNodeId} setActiveNodeId={setActiveNodeId} mode={gizmoMode} snapping={snapping} onNodeTransform={updateNodeTransform} setObjectPosition={setObjectPosition} />
        </Canvas>
      </div>

      {/* Floating Topbar */}
      <div className="floating-panel left-4 right-4 top-4 flex-row items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-app-accent font-bold text-white shadow-glow">A</div>
          <input className="bg-transparent text-sm font-semibold text-white outline-none" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button className="tool-btn flex items-center gap-2" onClick={() => setAiModalOpen(true)}>✨ AI Generate Room</button>
          <button className="tool-btn tool-btn-primary">Export Render</button>
        </div>
      </div>

      {/* Floating Left Panel (Hierarchy) */}
      <aside className="floating-panel bottom-24 left-4 top-24 w-64">
        <div className="panel-title">Hierarchy</div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-2 px-2 text-[10px] uppercase text-white/50">Architecture</div>
          {structures.map(s => (
            <div key={s.id} onClick={() => setActiveNodeId(s.id)} className={`hierarchy-item ${activeNodeId === s.id ? 'hierarchy-item-active' : ''}`}>🧱 {s.name}</div>
          ))}
          <div className="mb-2 mt-6 px-2 text-[10px] uppercase text-white/50">Furnishings</div>
          {nodes.map(n => (
            <div key={n.id} onClick={() => setActiveNodeId(n.id)} className={`hierarchy-item ${activeNodeId === n.id ? 'hierarchy-item-active' : ''}`}>▣ {n.name}</div>
          ))}
        </div>
      </aside>

      {/* Floating Right Panel (Inspector & Catalog) */}
      <aside className="floating-panel bottom-24 right-4 top-24 w-[340px] flex-col gap-0">
        <div className="flex flex-shrink-0 flex-col border-b border-white/5">
          <div className="panel-title">Object Inspector</div>
          <div className="p-4">
            <div className="inspector-row"><span>Position X</span><span className="font-mono text-white">{objectPosition.x.toFixed(2)}m</span></div>
            <div className="inspector-row"><span>Position Y</span><span className="font-mono text-white">{objectPosition.y.toFixed(2)}m</span></div>
            <div className="inspector-row border-none"><span>Position Z</span><span className="font-mono text-white">{objectPosition.z.toFixed(2)}m</span></div>
            {selectedAsset && (
              <button className="tool-btn tool-btn-primary mt-4 w-full py-2.5">Shop {selectedAsset.name} Online</button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="panel-title border-t border-white/5">Asset Library</div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {CATALOG.map((asset) => (
                <div key={asset.id} onClick={() => addAsset(asset)} className="catalog-card">
                  <div className="mb-3 h-20 w-full rounded-lg bg-black/50" style={{ borderBottom: `4px solid ${asset.hexColor}` }} />
                  <div className="truncate text-xs font-semibold text-white">{asset.name}</div>
                  <div className="mt-1 text-[10px] text-white/50">{asset.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Floating Bottom Toolbar (Gizmo Controls) */}
      <div className="floating-panel bottom-6 left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 px-4 py-2">
        <button className={`tool-icon-btn ${gizmoMode === 'translate' ? 'active' : ''}`} onClick={() => setGizmoMode('translate')} title="Translate (W)">🖐</button>
        <button className={`tool-icon-btn ${gizmoMode === 'rotate' ? 'active' : ''}`} onClick={() => setGizmoMode('rotate')} title="Rotate (E)">↻</button>
        <div className="mx-2 h-6 w-px bg-white/10" />
        <button className={`tool-icon-btn ${snapping ? 'active' : ''}`} onClick={() => setSnapping((v) => !v)} title="Grid Snap (S)">🧲</button>
      </div>

      {/* AI Upload Modal */}
      {aiModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Generate Room from Photo</h2>
              <button onClick={() => setAiModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            {aiLoadingState ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-pulse bg-app-accent shadow-glow" /></div>
                <div className="text-sm font-semibold tracking-wide text-app-accent">{aiLoadingState}</div>
              </div>
            ) : (
              <div onClick={handleImageUpload} className="cursor-pointer rounded-xl border-2 border-dashed border-white/20 bg-white/5 py-16 text-center text-sm font-medium text-white/70 transition-all hover:border-app-accent hover:bg-white/10">
                <span className="mb-3 block text-3xl">📸</span>
                Click to upload space photo
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}