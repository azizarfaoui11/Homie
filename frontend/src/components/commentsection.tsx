import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "../services/api";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.locale('fr');
dayjs.extend(relativeTime);

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [likedComments, setLikedComments] = useState<string[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.fetchcommentbypost(postId);
        setComments(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await api.addcomment({
        postId,
        content: commentText,
      });

      setComments((prev) => [...prev, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Erreur ajout commentaire', error);
    }
  };

 const handleLikeComment = async (commentId: string) => {
  try {
    const res = await api.likeComment(commentId);

    setComments(prev =>
      prev.map(c =>
        c._id === commentId ? { ...c, likes: Array(res.data.likeCount).fill('') } : c
      )
    );

    setLikedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  } catch (err) {
    console.error('Erreur like commentaire', err);
  }
};


  const handleReplyComment = async (parentCommentId: string, replyText: string) => {
    if (!replyText.trim()) return;

    try {
      await api.replyToComment({
        parentCommentId,
        content: replyText,
        postId,
      });

      setReplyText('');
      setReplyingTo(null);

      const refreshed = await api.fetchcommentbypost(postId);
      setComments(refreshed.data);
    } catch (err) {
      console.error('Erreur réponse', err);
    }
  };

  const renderReplies = (replies: any[]) => {
    return replies.map((reply) => (
      <div key={reply._id} className="ml-10 mt-2 flex items-start gap-3">
        <Avatar className="w-7 h-7 border border-gray-300">
          <AvatarFallback className="bg-blue-400 text-white text-xs">
            {reply.author?.nom?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="font-semibold text-sm text-gray-900">{reply.author?.nom}</p>
            <p className="text-sm text-gray-700">{reply.content}</p>
          </div>
          <div className="flex gap-4 mt-1 text-xs text-gray-500 ml-1">
            <span>{dayjs(reply.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-3 pt-2 px-4 pb-4">
      {/* Zone pour écrire un nouveau commentaire */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Écrire un commentaire..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-700"
        />
        <Button
          onClick={handleCommentSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-full"
        >
          Ajouter
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Liste des commentaires */}
      {comments
        .filter(comment => !comment.parentCommentId) 
.map((comment) => (
        <div key={comment._id} className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 border border-gray-300">
              <AvatarFallback className="bg-blue-500 text-white text-xs">
                {comment.author?.nom?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm text-gray-900">{comment.author?.nom}</p>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
              <button
  onClick={() => handleLikeComment(comment._id)}
  className={`hover:underline ${likedComments.includes(comment._id) ? 'text-blue-600 font-semibold' : ''}`}
>
  Like ({comment.likes?.length || 0})
</button>

                <button onClick={() => setReplyingTo(comment._id)} className="hover:underline">
                  Répondre
                </button>
                <span>{dayjs(comment.createdAt).fromNow()}</span>
              </div>
               {/* Affichage des réponses imbriquées */}
          {comment.replies?.length > 0 && renderReplies(comment.replies)}
            </div>
          </div>

          {/* Zone de réponse active */}
          {replyingTo === comment._id && (
            <div className="ml-10 flex items-center gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Votre réponse..."
                className="flex-1 bg-gray-50"
              />
              <Button
                className="bg-blue-500 text-white"
                onClick={() => handleReplyComment(comment._id, replyText)}
              >
                Envoyer
              </Button>
            </div>
          )}

         
        </div>
      ))}
    </div>
  );
}
