import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import FollowButton from './FollowButton';

interface FollowRelationsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowRelationsModal({ userId, isOpen, onClose }: FollowRelationsModalProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'suggested'>('followers');
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [suggested, setSuggested] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.suggestions().then((res) => setSuggested(res.data)).catch(console.error);
    }
  }, [isOpen]);

useEffect(() => {
  const fetchRelations = async () => {
    const followersRes = await api.getFollowers(userId);
    const followingRes = await api.getFollowing(userId);
    setFollowers(followersRes.data.followers);
    setFollowing(followingRes.data.following);
  };
  fetchRelations();
}, [userId]);


  const renderUsers = (users: any[], showFollowButton = false) => {
    if (users.length === 0) return <p className="text-gray-500 text-center py-4">Aucun résultat.</p>;
    return (
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user._id} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://placehold.co/40x40'}
                className="w-10 h-10 rounded-full object-cover"
                alt="avatar"
              />
              <div>
                <p className="font-semibold">{user.nom}</p>
                <p className="text-sm text-gray-500">@{user.username || user.nom.toLowerCase()}</p>
              </div>
            </div>
            {showFollowButton && <FollowButton targetId={user._id} currentUserId={userId} />}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="bg-white rounded-xl p-6 z-50 w-[480px] max-h-[80vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Réseau social</h2>

        {/* Tabs */}
        <div className="flex justify-between mb-4 border-b">
          {['followers', 'following', 'suggested'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-medium capitalize border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'followers' && 'Abonnés'}
              {tab === 'following' && 'Abonnements'}
              {tab === 'suggested' && 'Suggestions'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[200px]">
          {activeTab === 'followers' && renderUsers(followers)}
          {activeTab === 'following' && renderUsers(following)}
          {activeTab === 'suggested' && renderUsers(suggested, true)}
        </div>

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
