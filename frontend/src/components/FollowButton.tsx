import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface FollowButtonProps {
  targetId: string;
}

export default function FollowButton({  targetId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (!targetId) return;

    const checkFollow = async () => {
      try {
        const res = await api.checkIsFollowing(targetId);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error(err);
      }
    };
    checkFollow();
  }, [targetId]);

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await api.unfollowUser(targetId);
      } else {
        await api.followUser(targetId);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      className={`px-4 py-2 rounded ${
        isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      {isFollowing ? 'Se désabonner' : 'Suivre'}
    </button>
  );
}
