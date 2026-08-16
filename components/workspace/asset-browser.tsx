import type { RoomType, SceneAsset } from '@/types/app';

type Props = {
  roomType: RoomType;
  assets: SceneAsset[];
  query: string;
  setQuery: (value: string) => void;
  onAdd: (asset: SceneAsset) => void;
};

export function AssetBrowser({ roomType, assets, query, setQuery, onAdd }: Props) {
  const filtered = assets.filter((a) => {
    const inRoom = roomType === a.roomType || a.roomType === 'floral';
    const matches = a.name.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase());
    return inRoom && matches;
  });

  return (
    <section className="panel flex min-h-0 flex-col overflow-hidden">
      <div className="panel-title">Catalog</div>
      <div className="border-b border-app-line p-3">
        <input
          className="w-full rounded-md border border-app-line bg-app-panelSoft px-3 py-2 text-sm outline-none focus:border-app-accent"
          placeholder="Search catalog"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto p-3">
        {filtered.map((asset) => (
          <article key={asset.id} className="catalog-card">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-app-textStrong">{asset.name}</h4>
                <p className="text-xs text-app-text">{asset.vendor}</p>
              </div>
              <span className="rounded border border-app-line px-2 py-0.5 text-[11px] text-app-text">{asset.category}</span>
            </div>
            <button className="tool-btn w-full" onClick={() => onAdd(asset)}>Add to Scene</button>
          </article>
        ))}
      </div>
    </section>
  );
}
