import { useEffect, useState } from 'react';
import { api } from '../services/api';
import FollowButton from '../components/FollowButton';

export default function AllUsers() {
  const [users, setUsers] = useState([]); // ← CORRECTION ICI
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getusers();
        setUsers(res.data.filter((u: any) => u._id !== currentUser.id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      {users.map((user) => (
        <div key={user._id} className="flex items-center justify-between p-4 border rounded">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar ? `http://localhost:5000/uploads/${user?.avatar}` : 'https://placehold.co/60x60'}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <span className="font-semibold">{user?.nom}</span>
          </div>

          <FollowButton targetId={user._id}  />
        </div>
      ))}
    </div>
  );
}
