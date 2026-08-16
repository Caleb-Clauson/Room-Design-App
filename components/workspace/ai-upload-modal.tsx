import { motion } from 'framer-motion';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onGenerate: (file: File) => Promise<void>;
};

export function AiUploadModal({ open, onClose, onGenerate }: Props) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');

  async function handleFile(file?: File) {
    if (!file) return;
    setProcessing(true);
    setStatus('Analyzing geometry');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('Preserving fixed appliances');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('Building interactive scene');
    await onGenerate(file);
    setProcessing(false);
    setStatus('');
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-backdrop" />
        <Dialog.Content asChild>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="modal-panel">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-app-textStrong">AI Image to 3D</h3>
          <button className="tool-btn" onClick={onClose}>Close</button>
        </div>

        {processing ? (
          <div className="rounded-lg border border-app-line bg-app-panelSoft p-4 text-sm text-app-textStrong">{status}...</div>
        ) : (
          <label className="block cursor-pointer rounded-lg border border-dashed border-app-line bg-app-panelSoft p-8 text-center text-sm text-app-text hover:border-app-accent">
            Upload kitchen, laundry, office, or floral space image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
