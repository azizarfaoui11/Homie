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
  videoId: string;
}

export default function CommentSectionvideo({ videoId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getCommentsForVideo(videoId);
        setComments(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, [videoId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await api.addCommentToVideo({
        videoId,
        content: commentText,
      });

     const refreshed = await api.getCommentsForVideo(videoId);
     setComments(refreshed.data);
      setCommentText('');
    } catch (error) {
      console.error('Erreur ajout commentaire', error);
    }
  };

 
  const setReplyingTo= async()=>{

   }


  


  

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
.map((comment) => (
        <div key={comment._id} className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 border border-gray-300">
                 <img
                src={comment.author.avatar ? `http://localhost:5000/uploads/${comment.author.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />  
                {comment.author?.nom?.[0]?.toUpperCase()}

            </Avatar>





            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm text-gray-900">{comment.author?.nom}</p>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
          

                <button onClick={() => setReplyingTo()} className="hover:underline">
                  Répondre
                </button>
                <span>{dayjs(comment.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>

        

         
        </div>
      ))}
    </div>
  );
}
