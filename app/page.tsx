'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, TransformControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type AppMode = 'build' | 'furnish';
type TransformMode = 'translate' | 'rotate';

type CatalogAsset = {
  id: string;
  name: string;
  category: string;
  price: string;
  provider: string;
  shopUrl: string;
  hexColor: string;
  dimensions: { w: number; h: number; d: number };
  shape: 'box' | 'cylinder';
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

const PRODUCT_CATALOG: CatalogAsset[] = [
  { id: 'item-sofa', name: 'Nordic Minimalist Sofa', category: 'Living Room', price: '$1,299', provider: 'Article', shopUrl: 'https://www.article.com', hexColor: '#27272a', dimensions: { w: 2.2, h: 0.8, d: 0.9 }, shape: 'box' },
  { id: 'item-island', name: 'Quartz Waterfall Island', category: 'Kitchen', price: '$2,450', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', hexColor: '#f8fafc', dimensions: { w: 3.0, h: 1.0, d: 1.2 }, shape: 'box' },
  { id: 'item-stove', name: 'Pro Gas Range Stove', category: 'Kitchen', price: '$1,899', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', hexColor: '#09090b', dimensions: { w: 0.9, h: 0.9, d: 0.6 }, shape: 'box' },
  { id: 'item-fridge', name: 'French Door Smart Refrigerator', category: 'Kitchen', price: '$2,799', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', hexColor: '#71717a', dimensions: { w: 0.9, h: 1.8, d: 0.8 }, shape: 'box' },
  { id: 'item-floral', name: 'Handmade Botanical Floral Centerpiece', category: 'Decor', price: '$125', provider: 'Home Goods', shopUrl: 'https://www.homegoods.com', hexColor: '#e11d48', dimensions: { w: 0.4, h: 0.5, d: 0.4 }, shape: 'cylinder' },
  { id: 'item-desk', name: 'Executive Solid Oak Desk', category: 'Office', price: '$850', provider: 'Article', shopUrl: 'https://www.article.com', hexColor: '#78350f', dimensions: { w: 1.6, h: 0.75, d: 0.8 }, shape: 'box' },
  { id: 'item-washer', name: 'High-Efficiency Steam Washer', category: 'Laundry', price: '$1,099', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', hexColor: '#ffffff', dimensions: { w: 0.7, h: 0.9, d: 0.7 }, shape: 'box' },
];

const INITIAL_WALLS: StructuralNode[] = [
  { id: 'wall-back', type: 'wall', name: 'Back Room Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
  { id: 'wall-left', type: 'wall', name: 'Left Room Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
];

const INITIAL_NODES: SceneNode[] = [
  { id: 'node-sofa', assetId: 'item-sofa', name: 'Nordic Minimalist Sofa', position: [0, 0.4, 1.5], rotation: [0, 0, 0] },
  { id: 'node-floral', assetId: 'item-floral', name: 'Modern Floral Centerpiece', position: [0, 0.9, 1.5], rotation: [0, 0, 0] },
];

function ViewportScene({ nodes, structures, activeId, setActiveId, gizmoMode, snapping, onTransform, setPos }: any) {
  const { scene } = useThree();
  const orbitRef = useRef<any>(null);
  const [targetObj, setTargetObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (activeId) {
      const obj = scene.getObjectByName(activeId);
      if (obj) setTargetObj(obj);
    } else {
      setTargetObj(null);
    }
  }, [activeId, scene]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 25, 15]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
      <Environment preset="apartment" />
      
      <Grid infiniteGrid fadeDistance={50} sectionColor="#334155" cellColor="#1e293b" position={[0, -0.01, 0]} />

      {structures.map((wall: StructuralNode) => (
        <mesh key={wall.id} name={wall.id} position={wall.position} rotation={wall.rotation} receiveShadow
          onClick={(e) => { e.stopPropagation(); setActiveId(wall.id); }}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}

      {nodes.map((node: SceneNode) => {
        const asset = PRODUCT_CATALOG.find((a) => a.id === node.assetId);
        if (!asset) return null;
        return (
          <mesh key={node.id} name={node.id} position={node.position} rotation={node.rotation} castShadow receiveShadow
            onClick={(e) => { e.stopPropagation(); setActiveId(node.id); }}>
            {asset.shape === 'box' ? (
              <boxGeometry args={[asset.dimensions.w, asset.dimensions.h, asset.dimensions.d]} />
            ) : (
              <cylinderGeometry args={[asset.dimensions.w, asset.dimensions.w, asset.dimensions.h, 32]} />
            )}
            <meshStandardMaterial color={asset.hexColor} roughness={0.3} metalness={0.4} />
          </mesh>
        );
      })}

      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={30} blur={2.5} far={6} />

      {targetObj && (
        <TransformControls object={targetObj} mode={gizmoMode} translationSnap={snapping ? 0.25 : null} rotationSnap={snapping ? Math.PI / 4 : null}
          onChange={() => setPos({ x: targetObj.position.x, y: targetObj.position.y, z: targetObj.position.z })}
          onMouseDown={() => { if (orbitRef.current) orbitRef.current.enabled = false; }}
          onMouseUp={() => { if (orbitRef.current) orbitRef.current.enabled = true; onTransform(activeId, targetObj.position, targetObj.rotation); }}
        />
      )}
      <OrbitControls ref={orbitRef} makeDefault minPolarAngle={0.1} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

export default function StudioWorkspace() {
  const [projectName, setProjectName] = useState('My Dream Living Room & Kitchen');
  const [appMode, setAppMode] = useState<AppMode>('furnish');
  
  const [structures, setStructures] = useState<StructuralNode[]>(INITIAL_WALLS);
  const [nodes, setNodes] = useState<SceneNode[]>(INITIAL_NODES);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [gizmoMode, setGizmoMode] = useState<TransformMode>('translate');
  const [snapping, setSnapping] = useState(true);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, z: 0 });

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiStep, setAiStep] = useState('');

  const activeNode = nodes.find((n) => n.id === activeId);
  const activeAsset = activeNode ? PRODUCT_CATALOG.find((a) => a.id === activeNode.assetId) : null;

  function handleTransform(id: string, pos: THREE.Vector3, rot: THREE.Euler) {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, position: [pos.x, pos.y, pos.z], rotation: [rot.x, rot.y, rot.z] } : n));
    setStructures((prev) => prev.map((s) => s.id === id ? { ...s, position: [pos.x, pos.y, pos.z], rotation: [rot.x, rot.y, rot.z] } : s));
  }

  function addAssetToScene(asset: CatalogAsset) {
    const id = `node-${Date.now()}`;
    const newNode: SceneNode = {
      id,
      assetId: asset.id,
      name: asset.name,
      position: [0, asset.dimensions.h / 2, 0],
      rotation: [0, 0, 0],
    };
    setNodes((prev) => [...prev, newNode]);
    setActiveId(id);
  }

  function addStructuralWall() {
    const id = `wall-${Date.now()}`;
    const newWall: StructuralNode = {
      id,
      type: 'wall',
      name: `Partition Wall ${structures.length + 1}`,
      position: [2, 1.5, 0],
      rotation: [0, 0, 0],
      size: [3, 3, 0.2],
    };
    setStructures((prev) => [...prev, newWall]);
    setActiveId(id);
  }

  const simulateAiGeneration = () => {
    setAiStep('Scanning spatial layouts & depth vectors...');
    setTimeout(() => setAiStep('Matching architectural boundaries & scaling proportions...'), 1500);
    setTimeout(() => setAiStep('Placing verified vendor furniture & decor elements...'), 3000);
    setTimeout(() => {
      setStructures([
        { id: 'wall-back', type: 'wall', name: 'Back Kitchen Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
        { id: 'wall-left', type: 'wall', name: 'Left Kitchen Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
      ]);
      setNodes([
        { id: 'k-island', assetId: 'item-island', name: 'Quartz Waterfall Island', position: [0, 0.5, 0], rotation: [0, 0, 0] },
        { id: 'k-stove', assetId: 'item-stove', name: 'Pro Gas Range Stove', position: [0, 0.9, 0], rotation: [0, 0, 0] },
        { id: 'k-fridge', assetId: 'item-fridge', name: 'French Door Smart Refrigerator', position: [-4.2, 0.9, -2.5], rotation: [0, 0, 0] },
        { id: 'k-floral', assetId: 'item-floral', name: 'Modern Floral Centerpiece', position: [0, 1.25, 0], rotation: [0, 0, 0] },
      ]);
      setAiStep('');
      setAiModalOpen(false);
    }, 4500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w') setGizmoMode('translate');
      if (k === 'e') setGizmoMode('rotate');
      if (k === 's') setSnapping((v) => !v);
      if ((k === 'delete' || k === 'backspace') && activeId) {
        setNodes((prev) => prev.filter((n) => n.id !== activeId));
        setStructures((prev) => prev.filter((s) => s.id !== activeId));
        setActiveId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId]);

  return (
    <main className="workspace-shell">
      {/* 3D Viewport Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [8, 8, 12], fov: 45 }}>
          <ViewportScene 
            nodes={nodes} 
            structures={structures} 
            activeId={activeId} 
            setActiveId={setActiveId} 
            gizmoMode={gizmoMode} 
            snapping={snapping} 
            onTransform={handleTransform} 
            setPos={setCurrentPos} 
          />
        </Canvas>
      </div>

      {/* Floating Topbar Header */}
      <header className="floating-panel left-4 right-4 top-4 flex-row items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 font-black text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">NF</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nest & Frame Studio</div>
            <input className="bg-transparent text-sm font-bold text-white outline-none" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="tool-btn" onClick={() => setAiModalOpen(true)}>✨ AI Generate Room</button>
          <button className="tool-btn tool-btn-primary">Export Shopping List</button>
        </div>
      </header>

      {/* Left Panel: Scene Hierarchy & Architecture tree */}
      <aside className="floating-panel bottom-24 left-4 top-24 w-72">
        <div className="panel-title">Project Hierarchy</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Structural Walls</div>
          {structures.map((s) => (
            <div key={s.id} onClick={() => setActiveId(s.id)} className={`hierarchy-item ${activeId === s.id ? 'hierarchy-item-active' : ''}`}>
              🧱 {s.name}
            </div>
          ))}

          <div className="mb-1 mt-6 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Furniture & Decor</div>
          {nodes.map((n) => (
            <div key={n.id} onClick={() => setActiveId(n.id)} className={`hierarchy-item ${activeId === n.id ? 'hierarchy-item-active' : ''}`}>
              ▣ {n.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Right Panel: Mode Switcher, Inspector & Shoppable Asset Browser */}
      <aside className="floating-panel bottom-24 right-4 top-24 w-[380px] flex-col gap-0">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 p-2">
          <button 
            className={`rounded-lg py-2 text-xs font-bold transition-all ${appMode === 'furnish' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setAppMode('furnish')}
          >
            🛋 Furnish Mode
          </button>
          <button 
            className={`rounded-lg py-2 text-xs font-bold transition-all ${appMode === 'build' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setAppMode('build')}
          >
            🏗 Build Mode
          </button>
        </div>

        {/* Dynamic Content Panel */}
        {appMode === 'furnish' ? (
          <>
            <div className="flex flex-shrink-0 flex-col border-b border-slate-800">
              <div className="panel-title">Object Inspector & E-commerce</div>
              <div className="p-4 space-y-2">
                {activeAsset ? (
                  <>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Selected Item</span><span className="font-bold text-white">{activeAsset.name}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Retailer</span><span className="font-bold text-cyan-400">{activeAsset.provider}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Price</span><span className="font-bold text-emerald-400">{activeAsset.price}</span></div>
                    <a href={activeAsset.shopUrl} target="_blank" rel="noreferrer" className="tool-btn tool-btn-primary mt-3 w-full justify-center py-2.5 text-center">
                      🔗 Shop Online at {activeAsset.provider}
                    </a>
                  </>
                ) : (
                  <div className="py-2 text-xs text-slate-500 text-center">Select an item in the 3D space to view product details & purchase links.</div>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="panel-title border-t border-slate-800">Shoppable Catalog</div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_CATALOG.map((asset) => (
                    <div key={asset.id} onClick={() => addAssetToScene(asset)} className="catalog-card">
                      <div className="mb-2 h-16 w-full rounded-xl bg-black/40 border border-slate-800 flex items-center justify-center">
                        <div className="h-4 w-10 rounded shadow" style={{ backgroundColor: asset.hexColor }} />
                      </div>
                      <div className="truncate text-xs font-bold text-white">{asset.name}</div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-semibold">{asset.price}</span>
                        <span className="text-slate-400">{asset.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col p-6 space-y-4">
            <div className="panel-title border-none p-0">Structural Builder Controls</div>
            <p className="text-xs text-slate-400 leading-relaxed">Customize your floor plan boundaries and layout constraints without altering room ratios.</p>
            <button className="tool-btn tool-btn-primary w-full justify-center py-3" onClick={addStructuralWall}>
              🧱 Add Partition Wall
            </button>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2 mt-4">
              <div className="text-xs font-bold text-white">Grid Snapping Rules</div>
              <div className="text-[11px] text-slate-400">Objects automatically lock to structural angles and surfaces to prevent floating items or overlap collisions.</div>
            </div>
          </div>
        )}
      </aside>

      {/* Floating Bottom Toolbar (Transform Controls) */}
      <div className="floating-panel bottom-6 left-1/2 flex -translate-x-1/2 flex-row items-center gap-3 px-5 py-2.5">
        <button className={`tool-btn ${gizmoMode === 'translate' ? 'tool-btn-primary' : ''}`} onClick={() => setGizmoMode('translate')} title="Move Tool (W)">🖐 Move</button>
        <button className={`tool-btn ${gizmoMode === 'rotate' ? 'tool-btn-primary' : ''}`} onClick={() => setGizmoMode('rotate')} title="Rotate Tool (E)">↻ Rotate</button>
        <div className="h-6 w-px bg-slate-800" />
        <button className={`tool-btn ${snapping ? 'tool-btn-primary' : ''}`} onClick={() => setSnapping((v) => !v)} title="Toggle Snapping (S)">🧲 Snap {snapping ? 'On' : 'Off'}</button>
      </div>

      {/* AI Room Generation Modal */}
      {aiModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">AI Room & Layout Generator</h2>
              <button onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>
            
            {aiStep ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800"><div className="h-full w-2/5 animate-pulse bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" /></div>
                <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{aiStep}</div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 py-12 text-center transition-all hover:border-cyan-500 hover:bg-slate-900">
                  <span className="mb-2 text-3xl">📸</span>
                  <span className="text-sm font-semibold text-white">Click or drop a photo of your room</span>
                  <span className="mt-1 text-xs text-slate-400">Our AI model will reconstruct dimensions and populate shoppable items</span>
                  <input type="file" accept="image/*" className="hidden" onChange={simulateAiGeneration} />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}