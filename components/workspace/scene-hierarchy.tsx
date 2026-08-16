import clsx from 'clsx';

type NodeItem = { id: string; name: string; icon: string };

type Props = {
  activeId: string | null;
  structures: NodeItem[];
  assets: NodeItem[];
  onSelect: (id: string) => void;
};

export function SceneHierarchy({ activeId, structures, assets, onSelect }: Props) {
  return (
    <aside className="panel overflow-hidden">
      <div className="panel-title">Scene Hierarchy</div>
      <div className="h-[calc(100%-45px)] overflow-auto p-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-app-text">Architecture</div>
        <div className="space-y-1">
          {structures.map((n) => (
            <button
              key={n.id}
              className={clsx('hierarchy-item w-full text-left', activeId === n.id && 'hierarchy-item-active')}
              onClick={() => onSelect(n.id)}
            >
              <span>{n.icon}</span>
              <span>{n.name}</span>
            </button>
          ))}
        </div>

        <div className="mb-2 mt-5 text-[10px] uppercase tracking-[0.14em] text-app-text">Furnishings</div>
        <div className="space-y-1">
          {assets.map((n) => (
            <button
              key={n.id}
              className={clsx('hierarchy-item w-full text-left', activeId === n.id && 'hierarchy-item-active')}
              onClick={() => onSelect(n.id)}
            >
              <span>{n.icon}</span>
              <span>{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
