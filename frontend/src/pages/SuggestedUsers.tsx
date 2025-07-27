import { useEffect, useState } from 'react';
import { api } from '../services/api';
import FollowButton from '../components/FollowButton';

export default function SuggestedUsers() {
  const [suggested, setSuggested] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.suggestions(); // appel direct à ta route backend /suggestions
        setSuggested(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Suggestions pour vous</h1>
      <div className="space-y-4">
        {suggested.length === 0 ? (
          <p className="text-gray-500">Aucune suggestion pour l’instant.</p>
        ) : (
          suggested.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://placehold.co/50x50'}
                  className="w-12 h-12 rounded-full"
                  alt="avatar"
                />
                <div>
                  <p className="font-semibold">{user.nom}</p>
                  <p className="text-sm text-gray-500">@{user.username || user.nom.toLowerCase()}</p>
                </div>
              </div>
              <FollowButton targetId={user._id} currentUserId={''} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
