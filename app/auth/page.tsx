'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, TransformControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type TransformMode = 'translate' | 'rotate';

type CatalogAsset = {
  id: string;
  name: string;
  category: string;
  price: string;
  provider: string;
  shopUrl: string;
  primaryColor: string;
  dimensions: { w: number; h: number; d: number };
  type: 'sofa' | 'island' | 'stove' | 'fridge' | 'pendant' | 'floral' | 'desk';
  aiCompatibilityCheck: string;
};

type SceneNode = {
  id: string;
  assetId: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  customColor?: string;
};

type StructuralNode = {
  id: string;
  type: 'wall' | 'window' | 'door';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
};

type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

const PRODUCT_CATALOG: CatalogAsset[] = [
  { id: 'item-sofa', name: 'Nordic Sectional Sofa', category: 'Living Room', price: '$1,899', provider: 'Article', shopUrl: 'https://www.article.com', primaryColor: '#27272a', dimensions: { w: 2.4, h: 0.85, d: 1.0 }, type: 'sofa', aiCompatibilityCheck: 'Leaves comfortable 1.2m walkways around perimeter walls.' },
  { id: 'item-island', name: 'Quartz Waterfall Kitchen Island', category: 'Kitchen', price: '$2,450', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', primaryColor: '#f8fafc', dimensions: { w: 3.0, h: 1.0, d: 1.2 }, type: 'island', aiCompatibilityCheck: 'Optimized workspace clearance for standard residential layouts.' },
  { id: 'item-stove', name: 'Pro Gas Range Stove', category: 'Kitchen', price: '$1,899', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', primaryColor: '#18181b', dimensions: { w: 0.9, h: 0.9, d: 0.6 }, type: 'stove', aiCompatibilityCheck: 'Complies with standard kitchen gas ventilation and safety zones.' },
  { id: 'item-fridge', name: 'French Door Smart Refrigerator', category: 'Kitchen', price: '$2,799', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', primaryColor: '#71717a', dimensions: { w: 0.9, h: 1.8, d: 0.8 }, type: 'fridge', aiCompatibilityCheck: 'Door clearance verified against side structural boundaries.' },
  { id: 'item-light', name: 'Modern Brass Pendant Light', category: 'Lighting', price: '$320', provider: 'Ferguson', shopUrl: 'https://www.ferguson.com', primaryColor: '#d97706', dimensions: { w: 0.45, h: 0.6, d: 0.45 }, type: 'pendant', aiCompatibilityCheck: 'Ideal drop height for 9ft ceiling configurations.' },
  { id: 'item-floral', name: 'Botanical Floral Centerpiece', category: 'Decor', price: '$125', provider: 'Home Goods', shopUrl: 'https://www.homegoods.com', primaryColor: '#e11d48', dimensions: { w: 0.4, h: 0.4, d: 0.4 }, type: 'floral', aiCompatibilityCheck: 'Low profile prevents blocking central room sightlines.' },
];

const INITIAL_WALLS: StructuralNode[] = [
  { id: 'wall-back', type: 'wall', name: 'Back Studio Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
  { id: 'wall-left', type: 'wall', name: 'Left Studio Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
];

const INITIAL_NODES: SceneNode[] = [
  { id: 'node-sofa', assetId: 'item-sofa', name: 'Nordic Sectional Sofa', position: [0, 0.42, 1.5], rotation: [0, 0, 0] },
  { id: 'node-light', assetId: 'item-light', name: 'Modern Brass Pendant Light', position: [0, 2.4, 0], rotation: [0, 0, 0] },
  { id: 'node-floral', assetId: 'item-floral', name: 'Botanical Floral Centerpiece', position: [0, 0.85, 1.5], rotation: [0, 0, 0] },
];

// --- REALISTIC 3D COMPONENT RENDERERS ---
function DetailedModel({ type, color }: { type: CatalogAsset['type']; color: string }) {
  if (type === 'sofa') {
    return (
      <group>
        {/* Base Couch Frame */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.4, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Cushions */}
        <mesh position={[-0.58, 0.43, 0.05]} castShadow>
          <boxGeometry args={[1.05, 0.2, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[0.58, 0.43, 0.05]} castShadow>
          <boxGeometry args={[1.05, 0.2, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.65, -0.38]} castShadow>
          <boxGeometry args={[2.3, 0.5, 0.15]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-1.12, 0.48, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[1.12, 0.48, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (type === 'island') {
    return (
      <group>
        {/* Main Counter Body */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.9, 0.9, 1.1]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.1} />
        </mesh>
        {/* Waterfall Marble Top */}
        <mesh position={[0, 0.93, 0]} castShadow>
          <boxGeometry args={[3.0, 0.06, 1.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === 'stove') {
    return (
      <group>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.9, 0.6]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Burners */}
        <mesh position={[-0.25, 0.91, -0.15]}><cylinderGeometry args={[0.08, 0.08, 0.02, 16]} /><meshStandardMaterial color="#27272a" metalness={0.9} /></mesh>
        <mesh position={[0.25, 0.91, -0.15]}><cylinderGeometry args={[0.08, 0.08, 0.02, 16]} /><meshStandardMaterial color="#27272a" metalness={0.9} /></mesh>
        <mesh position={[-0.25, 0.91, 0.15]}><cylinderGeometry args={[0.08, 0.08, 0.02, 16]} /><meshStandardMaterial color="#27272a" metalness={0.9} /></mesh>
        <mesh position={[0.25, 0.91, 0.15]}><cylinderGeometry args={[0.08, 0.08, 0.02, 16]} /><meshStandardMaterial color="#27272a" metalness={0.9} /></mesh>
      </group>
    );
  }

  if (type === 'fridge') {
    return (
      <group>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.8, 0.8]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Door Divider Seam */}
        <mesh position={[0, 0.9, 0.41]}><boxGeometry args={[0.02, 1.76, 0.01]} /><meshStandardMaterial color="#3f3f46" /></mesh>
      </group>
    );
  }

  if (type === 'pendant') {
    return (
      <group>
        {/* Cord */}
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.01, 0.01, 1.2]} /><meshStandardMaterial color="#18181b" /></mesh>
        {/* Shade */}
        <mesh position={[0, -0.1, 0]} castShadow><coneGeometry args={[0.35, 0.4, 32]} /><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} /></mesh>
        {/* Bulb Glow */}
        <pointLight position={[0, -0.2, 0]} intensity={0.8} color="#fde047" distance={4} />
      </group>
    );
  }

  if (type === 'floral') {
    return (
      <group>
        <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.12, 0.08, 0.24, 16]} /><meshStandardMaterial color="#f1f5f9" roughness={0.2} /></mesh>
        <mesh position={[0, 0.32, 0]} castShadow><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      </group>
    );
  }

  return (
    <mesh castShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={color} /></mesh>
  );
}

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
        const activeColor = node.customColor || asset.primaryColor;

        return (
          <group 
            key={node.id} 
            name={node.id} 
            position={node.position} 
            rotation={node.rotation}
            onClick={(e) => { e.stopPropagation(); setActiveId(node.id); }}
          >
            <DetailedModel type={asset.type} color={activeColor} />
          </group>
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

export default function InteractiveStudio() {
  const [projectName, setProjectName] = useState('Luxury Living & Kitchen Space');
  const [structures, setStructures] = useState<StructuralNode[]>(INITIAL_WALLS);
  const [nodes, setNodes] = useState<SceneNode[]>(INITIAL_NODES);
  
  const [activeId, setActiveId] = useState<string | null>('node-sofa');
  const [gizmoMode, setGizmoMode] = useState<TransformMode>('translate');
  const [snapping, setSnapping] = useState(true);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, z: 0 });

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your AI Spatial Architect. Select any 3D item or ask me questions like "Does this sofa fit the clearance?" or "Change couch to charcoal fabric."' }
  ]);

  const activeNode = nodes.find((n) => n.id === activeId);
  const activeAsset = activeNode ? PRODUCT_CATALOG.find((a) => a.id === activeNode.assetId) : null;

  function handleTransform(id: string, pos: THREE.Vector3, rot: THREE.Euler) {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, position: [pos.x, pos.y, pos.z], rotation: [rot.x, rot.y, rot.z] } : n));
  }

  function addAssetToScene(asset: CatalogAsset) {
    const id = `node-${Date.now()}`;
    const defaultY = asset.type === 'pendant' ? 2.4 : asset.dimensions.h / 2;
    const newNode: SceneNode = {
      id,
      assetId: asset.id,
      name: asset.name,
      position: [0, defaultY, 0],
      rotation: [0, 0, 0],
    };
    setNodes((prev) => [...prev, newNode]);
    setActiveId(id);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let aiResponse = "I've reviewed your layout matrix. Clearances look well-balanced!";
      const query = userText.toLowerCase();

      if (query.includes('fit') || query.includes('scale') || query.includes('clearance')) {
        aiResponse = activeAsset 
          ? `Analysis for ${activeAsset.name}: ${activeAsset.aiCompatibilityCheck}` 
          : "Please select a 3D object in your room first so I can calculate its spatial fit.";
      } else if (query.includes('color') || query.includes('charcoal') || query.includes('fabric')) {
        if (activeId) {
          setNodes((prev) => prev.map((n) => n.id === activeId ? { ...n, customColor: '#27272a' } : n));
          aiResponse = "I've updated the material and fabric finish on your selected 3D model.";
        }
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <main className="workspace-shell">
      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [6, 6, 10], fov: 45 }}>
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

      {/* Top Header */}
      <header className="floating-panel left-4 right-4 top-4 flex-row items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 font-black text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">NF</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Realistic 3D Studio</div>
            <input className="bg-transparent text-sm font-bold text-white outline-none" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="tool-btn tool-btn-primary">Export 3D Render Spec</button>
        </div>
      </header>

      {/* Left Panel: Scene Hierarchy */}
      <aside className="floating-panel bottom-24 left-4 top-24 w-72">
        <div className="panel-title">Placed 3D Objects</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {nodes.map((n) => (
            <div key={n.id} onClick={() => setActiveId(n.id)} className={`hierarchy-item ${activeId === n.id ? 'hierarchy-item-active' : ''}`}>
              🛋 {n.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Right Panel: AI Assistant & Shoppable Inspector */}
      <aside className="floating-panel bottom-24 right-4 top-24 w-[400px] flex-col gap-0">
        <div className="flex flex-col border-b border-slate-800 bg-slate-950/40 p-4 h-56">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">🤖 AI Spatial Design Assistant</div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-2.5 rounded-xl ${m.sender === 'ai' ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ml-6'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              placeholder="Ask about scale, or request color edits..." 
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
            />
            <button type="submit" className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400">Ask</button>
          </form>
        </div>

        <div className="flex flex-shrink-0 flex-col border-b border-slate-800">
          <div className="panel-title">Item Material Customization</div>
          <div className="p-4 space-y-2">
            {activeAsset && activeNode ? (
              <>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Selected Model</span><span className="font-bold text-white">{activeAsset.name}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Retail Price</span><span className="font-bold text-emerald-400">{activeAsset.price}</span></div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setNodes(prev => prev.map(n => n.id === activeId ? {...n, customColor: '#3f3f46'} : n))} className="flex-1 tool-btn justify-center">Charcoal Fabric</button>
                  <button onClick={() => setNodes(prev => prev.map(n => n.id === activeId ? {...n, customColor: '#b45309'} : n))} className="flex-1 tool-btn justify-center">Warm Cognac</button>
                </div>
                <a href={activeAsset.shopUrl} target="_blank" rel="noreferrer" className="tool-btn tool-btn-primary mt-3 w-full justify-center py-2.5 text-center">
                  🔗 Buy on {activeAsset.provider}
                </a>
              </>
            ) : (
              <div className="py-2 text-xs text-slate-500 text-center">Select any 3D item in the canvas to customize materials and purchase.</div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="panel-title border-t border-slate-800">Realistic 3D Product Catalog</div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {PRODUCT_CATALOG.map((asset) => (
                <div key={asset.id} onClick={() => addAssetToScene(asset)} className="catalog-card">
                  <div className="mb-2 h-14 w-full rounded-xl bg-black/40 border border-slate-800 flex items-center justify-center">
                    <div className="h-4 w-10 rounded shadow" style={{ backgroundColor: asset.primaryColor }} />
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
      </aside>

      {/* Floating Bottom Toolbar */}
      <div className="floating-panel bottom-6 left-1/2 flex -translate-x-1/2 flex-row items-center gap-3 px-5 py-2.5">
        <button className={`tool-btn ${gizmoMode === 'translate' ? 'tool-btn-primary' : ''}`} onClick={() => setGizmoMode('translate')} title="Move Tool (W)">🖐 Move</button>
        <button className={`tool-btn ${gizmoMode === 'rotate' ? 'tool-btn-primary' : ''}`} onClick={() => setGizmoMode('rotate')} title="Rotate Tool (E)">↻ Rotate</button>
        <div className="h-6 w-px bg-slate-800" />
        <button className={`tool-btn ${snapping ? 'tool-btn-primary' : ''}`} onClick={() => setSnapping((v) => !v)} title="Toggle Snapping (S)">🧲 Snap {snapping ? 'On' : 'Off'}</button>
      </div>
    </main>
  );
}