import type { SceneAsset } from '@/types/app';

type Props = {
  selectedAsset: SceneAsset | null;
  objectPosition: { x: number; y: number; z: number };
};

export function ObjectInspector({ selectedAsset, objectPosition }: Props) {
  return (
    <section className="panel p-4">
      <div className="panel-title -mx-4 -mt-4 mb-3">Object Inspector</div>
      <div className="inspector-row">
        <span className="text-app-text">Position X</span>
        <span className="text-app-textStrong">{objectPosition.x.toFixed(2)} m</span>
      </div>
      <div className="inspector-row">
        <span className="text-app-text">Position Y</span>
        <span className="text-app-textStrong">{objectPosition.y.toFixed(2)} m</span>
      </div>
      <div className="inspector-row">
        <span className="text-app-text">Position Z</span>
        <span className="text-app-textStrong">{objectPosition.z.toFixed(2)} m</span>
      </div>

      {selectedAsset ? (
        <>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-app-text">Model</span>
              <span className="text-app-textStrong">{selectedAsset.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-app-text">Dimensions</span>
              <span className="text-app-textStrong">
                {selectedAsset.dimensions.w}m x {selectedAsset.dimensions.h}m x {selectedAsset.dimensions.d}m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-app-text">Vendor</span>
              <span className="text-app-textStrong">{selectedAsset.vendor}</span>
            </div>
          </div>
          <a className="tool-btn tool-btn-primary mt-4 block w-full text-center" href={selectedAsset.url} target="_blank" rel="noreferrer">
            Shop Online
          </a>
        </>
      ) : (
        <div className="mt-4 text-sm text-app-text">Select an asset to inspect and shop.</div>
      )}
    </section>
  );
}
