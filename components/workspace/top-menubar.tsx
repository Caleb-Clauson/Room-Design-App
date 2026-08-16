import { motion } from 'framer-motion';

type Props = {
  onOpenAiUpload: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
};

export function TopMenubar({ onOpenAiUpload, onSaveProject, onLoadProject }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-app-line px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md border border-app-line bg-app-panelSoft text-app-textStrong">N</div>
        <div>
          <div className="text-sm font-semibold text-app-textStrong">Nest and Frame Studio</div>
          <div className="text-xs text-app-text">Immersive Design Workspace</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="tool-btn" onClick={onLoadProject}>Load Project</button>
        <button className="tool-btn" onClick={onOpenAiUpload}>AI Image to 3D</button>
        <motion.button whileTap={{ scale: 0.97 }} className="tool-btn tool-btn-primary" onClick={onSaveProject}>
          Save to Cloud
        </motion.button>
      </div>
    </header>
  );
}
