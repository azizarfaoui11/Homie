// src/components/ChatModal.tsx
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import ChatPage from '../pages/chat';

interface ChatModalProps {
  recipientId: string | null;
  onClose: () => void;
}

export default function ChatModal({ recipientId, onClose }: ChatModalProps) {
  if (!recipientId) return null;

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="absolute bottom-6 right-6 w-full max-w-sm pointer-events-auto">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-200">
          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* Contenu du chat */}
          <ChatPage recipientId={recipientId} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
