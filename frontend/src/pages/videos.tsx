import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../services/api";
import { Avatar } from "@/components/ui/avatar";
import CommentSectionvideo from "@/components/commentsectionsvideos";

interface Video {
  _id: string;
  userId: { _id: string; nom: string; avatar?: string };
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  likes: string[]; // tableau d'userId qui ont liké
  comments: any[]; // tableau commentaires, ou au moins count
  createdAt: string;
}

const currentUserId = "ID_DE_L_UTILISATEUR_COURANT"; // Remplace par ID réel connecté

export default function VideoFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingLike, setLoadingLike] = useState<string | null>(null); // _id de vidéo en cours de like

  const loadMore = async () => {
    const limit = 5;
    const newVideos = await api.fetchAllVideos(page, limit);
    if (newVideos.length < limit) setHasMore(false);
    setVideos((prev) => [...prev, ...newVideos]);
    setPage((prev) => prev + 1);
  };

  // Fonction toggle like
  const handleLike = async (videoId: string, liked: boolean) => {
    if (loadingLike) return; // éviter spam
    setLoadingLike(videoId);

    try {
      if (liked) {
        // Unlike
        await api.unlikeVideo(videoId);
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId
              ? { ...v, likes: v.likes.filter((id) => id !== currentUserId) }
              : v
          )
        );
      } else {
        // Like
        await api.likeVideo(videoId);
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId ? { ...v, likes: [...v.likes, currentUserId] } : v
          )
        );
      }
    } catch (err) {
      console.error("Erreur like/unlike", err);
      // Optionnel : afficher message utilisateur
    } finally {
      setLoadingLike(null);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

return (
  <div className="min-h-screen bg-white py-8">
    <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
      🎥 Vidéos en ligne
    </h1>

    <InfiniteScroll
      dataLength={videos.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-6">
          <div className="loader rounded-full border-4 border-t-blue-500 h-10 w-10 animate-spin" />
        </div>
      }
      endMessage={
        <p className="text-center text-gray-500 py-6 text-sm">
          🎬 Fin du flux de vidéos
        </p>
      }
    >
      <div className="flex flex-col gap-10 px-4 max-w-2xl mx-auto">
        {videos.map((video) => {
          const liked = video.likes.includes(currentUserId);
          const date = new Date(video.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={video._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <video
                src={video.videoUrl}
                controls
                className="w-full max-h-[500px] object-cover"
              />

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    {video.userId.avatar ? (
                      <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
    <img
                src={video.userId.avatar ? `http://localhost:5000/uploads/${video.userId.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />               
                  </Avatar>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white uppercase">
                        {video.userId.nom[0]}
                      </div>
                    )}
                    <span className="font-medium text-gray-800">
                     Ajouté par   {video.userId.nom} 
                    </span>
                  </div>
                  <span className="text-xs">{date}</span>
                </div>

                {/* Titre + description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {video.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                    {video.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 text-gray-600 text-sm">
                  <button
                    onClick={() => handleLike(video._id, liked)}
                    disabled={loadingLike === video._id}
                    className={`flex items-center gap-1 transition ${
                      liked ? "text-red-500" : "hover:text-red-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        liked ? "fill-red-500" : "stroke-current"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61c-1.54-1.34-3.84-1.34-5.38 0L12 7.09l-3.46-2.48c-1.54-1.34-3.84-1.34-5.38 0-1.56 1.36-1.6 3.61-.1 5.02L12 21.35l8.94-11.72c1.5-1.41 1.46-3.66-.1-5.02z" />
                    </svg>
                    <span>{video.likes.length}</span>
                  </button>

                  <div className="flex items-center gap-1 hover:text-blue-500 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 16.98V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-4h12a2 2 0 002-2z"
                      />
                    </svg>
                    <span>{video.comments.length}</span>
                  </div>

                </div>
                                                       <CommentSectionvideo videoId={video._id} />

              </div>
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  </div>
);

}
