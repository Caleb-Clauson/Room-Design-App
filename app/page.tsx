'use client';

import { useEffect, useMemo, useState } from 'react';
import { AssetBrowser } from '@/components/workspace/asset-browser';
import { AiUploadModal } from '@/components/workspace/ai-upload-modal';
import { ObjectInspector } from '@/components/workspace/object-inspector';
import { SceneHierarchy } from '@/components/workspace/scene-hierarchy';
import { TopMenubar } from '@/components/workspace/top-menubar';
import { ViewportCanvas } from '@/components/workspace/viewport-canvas';
import { CATALOG } from '@/lib/catalog';
import { supabaseClient } from '@/lib/supabase/client';
import type { RoomType, SceneAsset, SceneNode, StructuralNode, TransformMode } from '@/types/app';

const DEFAULT_STRUCTURES: StructuralNode[] = [
  { id: 'wall-back', type: 'wall', name: 'Back Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
  { id: 'wall-left', type: 'wall', name: 'Left Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
];

const DEFAULT_NODES: SceneNode[] = [
  { id: 'node-island', assetId: 'asset-k-island', name: 'Arc Quartz Island', position: [0, 0.5, 0], rotation: [0, 0, 0], lockedTo: null },
  { id: 'node-stove', assetId: 'asset-k-stove', name: 'Chefline Pro Stove', position: [0, 0.9, 0], rotation: [0, 0, 0], lockedTo: 'island' },
  { id: 'node-fridge', assetId: 'asset-k-fridge', name: 'Nordic French Door Fridge', position: [-4.5, 0.92, -2.5], rotation: [0, 0, 0], lockedTo: 'wall' },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function HomePage() {
  const [userId, setUserId] = useState('demo-user');
  const [projectName, setProjectName] = useState('Premium Kitchen Concept');
  const [roomType, setRoomType] = useState<RoomType>('kitchen');
  const [roomBounds, setRoomBounds] = useState({ width: 10, depth: 8, height: 3 });

  const [structures, setStructures] = useState<StructuralNode[]>(DEFAULT_STRUCTURES);
  const [nodes, setNodes] = useState<SceneNode[]>(DEFAULT_NODES);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [gizmoMode, setGizmoMode] = useState<TransformMode>('translate');
  const [snapping, setSnapping] = useState(true);
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0.5, z: 0 });

  const [query, setQuery] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const hierarchyStructures = useMemo(
    () => structures.map((s) => ({ id: s.id, name: s.name, icon: s.type === 'wall' ? '🧱' : s.type === 'door' ? '🚪' : '🪟' })),
    [structures],
  );

  const hierarchyAssets = useMemo(() => nodes.map((n) => ({ id: n.id, name: n.name, icon: '▣' })), [nodes]);

  const selectedNode = nodes.find((n) => n.id === activeNodeId) ?? null;
  const selectedAsset: SceneAsset | null = selectedNode ? CATALOG.find((a) => a.id === selectedNode.assetId) ?? null : null;

  function updateNodeTransform(id: string, pos: [number, number, number], rot: [number, number, number]) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position: pos, rotation: rot } : n)));
    setStructures((prev) => prev.map((s) => (s.id === id ? { ...s, position: pos, rotation: rot } : s)));
  }

  function addAsset(asset: SceneAsset) {
    const id = uid('node');
    const node: SceneNode = {
      id,
      assetId: asset.id,
      name: asset.name,
      position: [0, asset.dimensions.h / 2, 0],
      rotation: [0, 0, 0],
      lockedTo: asset.collisionLock ?? null,
    };
    setNodes((prev) => [...prev, node]);
    setActiveNodeId(id);
  }

  function addWall() {
    const id = uid('wall');
    const wall: StructuralNode = {
      id,
      type: 'wall',
      name: `Wall ${structures.length + 1}`,
      position: [0, roomBounds.height / 2, 0],
      rotation: [0, 0, 0],
      size: [3, roomBounds.height, 0.2],
    };
    setStructures((prev) => [...prev, wall]);
    setActiveNodeId(id);
  }

  async function saveProject() {
    const payload = {
      id: uid('project'),
      userId,
      name: projectName,
      room_type: roomType,
      room_bounds: roomBounds,
      nodes,
      structures,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  async function loadProject() {
    const data = await fetch(`/api/projects?userId=${userId}`).then((r) => r.json());
    if (!Array.isArray(data) || data.length === 0) return;
    const project = data[0];
    setProjectName(project.name);
    setRoomType(project.room_type);
    setRoomBounds(project.room_bounds);
    setNodes(project.nodes ?? []);
    setStructures(project.structures ?? []);
  }

  async function generateFromImage() {
    setRoomType('kitchen');
    setRoomBounds({ width: 10, depth: 8, height: 3 });
    setStructures([
      { id: 'wall-back', type: 'wall', name: 'Back Wall', position: [0, 1.5, -4], rotation: [0, 0, 0], size: [10, 3, 0.2] },
      { id: 'wall-left', type: 'wall', name: 'Left Wall', position: [-5, 1.5, 0], rotation: [0, 0, 0], size: [0.2, 3, 8] },
    ]);

    setNodes([
      { id: 'node-island', assetId: 'asset-k-island', name: 'Arc Quartz Island', position: [0, 0.5, 0], rotation: [0, 0, 0], lockedTo: null },
      { id: 'node-stove', assetId: 'asset-k-stove', name: 'Chefline Pro Stove', position: [0, 0.9, 0], rotation: [0, 0, 0], lockedTo: 'island' },
      { id: 'node-fridge', assetId: 'asset-k-fridge', name: 'Nordic French Door Fridge', position: [-4.5, 0.92, -2.5], rotation: [0, 0, 0], lockedTo: 'wall' },
      { id: 'node-floral', assetId: 'asset-floral-arrangement', name: 'Signature Floral Arrangement', position: [2.2, 0.33, 0], rotation: [0, 0, 0], lockedTo: null },
    ]);
  }

  useEffect(() => {
    const maybeUser = supabaseClient;
    if (!maybeUser) return;
    maybeUser.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id);
    });
  }, []);

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
      <TopMenubar onOpenAiUpload={() => setAiModalOpen(true)} onSaveProject={saveProject} onLoadProject={loadProject} />

      <div className="workspace-grid">
        <SceneHierarchy activeId={activeNodeId} structures={hierarchyStructures} assets={hierarchyAssets} onSelect={setActiveNodeId} />

        <section className="flex min-h-0 flex-col gap-3">
          <div className="panel flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <button className="tool-btn" onClick={() => setGizmoMode('translate')}>Translate</button>
              <button className="tool-btn" onClick={() => setGizmoMode('rotate')}>Rotate</button>
              <button className="tool-btn" onClick={() => setSnapping((v) => !v)}>Snap {snapping ? 'On' : 'Off'}</button>
              <button className="tool-btn" onClick={addWall}>Add Wall</button>
            </div>
            <div className="flex items-center gap-2 text-xs text-app-text">
              <span>Project</span>
              <input
                className="w-48 rounded border border-app-line bg-app-panelSoft px-2 py-1"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </div>

          <ViewportCanvas
            roomBounds={roomBounds}
            nodes={nodes}
            structures={structures}
            activeNodeId={activeNodeId}
            setActiveNodeId={setActiveNodeId}
            mode={gizmoMode}
            snapping={snapping}
            onNodeTransform={updateNodeTransform}
            setObjectPosition={setObjectPosition}
          />
        </section>

        <aside className="flex min-h-0 flex-col gap-3">
          <ObjectInspector selectedAsset={selectedAsset} objectPosition={objectPosition} />
          <AssetBrowser roomType={roomType} assets={CATALOG} query={query} setQuery={setQuery} onAdd={addAsset} />
        </aside>
      </div>

      <AiUploadModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={async () => {
          await generateFromImage();
        }}
      />
    </main>
  );
}
