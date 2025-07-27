import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ChatModal from '../components/chatmodal';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

 // const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.getfriends();
        setUsers(res.data);
      } catch (err) {
        console.error('Erreur chargement événements', err);
      }
    };
    fetchFriends();
  }, []);

  return (
    <>
      <Card className="rounded-xl shadow-md p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Contacts</h2>
        <ul className="space-y-3">
          {users.map((user: any) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
             <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
    <img
                src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />               
                  </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="text-sm"
                onClick={() => setSelectedUserId(user._id)}
              >
                💬 Chat
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {selectedUserId && (
        <ChatModal 
          recipientId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
