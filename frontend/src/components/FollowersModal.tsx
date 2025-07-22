import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface FollowersModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowersModal({ userId, isOpen, onClose }: FollowersModalProps) {
  const [followers, setFollowers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchFollowers = async () => {
        const res = await api.getFollowers(userId);
        setFollowers(res.data);
      };
      fetchFollowers();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="bg-black/30 fixed inset-0" aria-hidden="true" />
      <div className="bg-white rounded-xl p-6 z-50 w-[400px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Abonnés</h2>
        {followers.length === 0 ? (
          <p className="text-gray-500">Aucun abonné.</p>
        ) : (
          <ul className="space-y-3">
            {followers.map((user) => (
              <li key={user._id} className="flex items-center gap-3">
                <img
                  src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://placehold.co/40x40'}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <span className="font-medium">{user.nom}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </Dialog>
  );
}
