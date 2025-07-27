import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserPlus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FollowButtonProps {
  targetId: string;
  currentUserId: string; // pour désactiver si c’est soi-même
}

export default function FollowButton({ targetId, currentUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followBack, setFollowBack] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isSelf = targetId === currentUserId;

  useEffect(() => {
    if (!targetId || isSelf) return;

    const checkFollow = async () => {
      try {
        const res = await api.checkFollowStatus(targetId);
        setIsFollowing(res.data.isFollowing);
        setFollowBack(res.data.followBack);
      } catch (err) {
        console.error(err);
      }
    };
    checkFollow();
  }, [targetId, isSelf]);

  const handleToggleFollow = async () => {
    if (isSelf) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await api.unfollowUser(targetId);
      } else {
        await api.followUser(targetId);
      }

      // Rafraîchir
      const res = await api.checkFollowStatus(targetId);
      setIsFollowing(res.data.isFollowing);
      setFollowBack(res.data.followBack);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = isFollowing
    ? followBack
      ? 'Amis ✓'
      : 'Se désabonner'
    : 'Suivre';

  const buttonIcon = isFollowing
    ? followBack
      ? <Check className="w-4 h-4 mr-2" />
      : <X className="w-4 h-4 mr-2" />
    : <UserPlus className="w-4 h-4 mr-2" />;

  const bgColor = isFollowing
    ? followBack
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-500 hover:bg-blue-600';

  return (
    <motion.button
      onClick={handleToggleFollow}
      disabled={isSelf || loading}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center px-4 py-2 text-white font-semibold rounded shadow transition duration-200 ${bgColor} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {buttonIcon}
      {buttonText}
    </motion.button>
  );
}
