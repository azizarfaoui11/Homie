import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; 
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; 
import UsersListPage from '../pages/UsersListPage';
import { Image as ImageIcon, Plus, PlusCircle } from 'lucide-react';
import {Home as HomeIcon,Users, Video, Store, Bell, MessageSquare, LogOut,Share,ThumbsUp } from 'lucide-react';
import ModalShare from "@/components/ModalShare";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import CommentSection from "@/components/commentsection";
import Geminimodal from "@/components/geminimodal";
import CreateEventModal from "@/components/CreateEventModal";

const Home = () => {




  const [newPostContent, setNewPostContent] = useState ({
content:'',
  image: null as File | null,


  });

  const [posts,setposts]=useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

const[event,setevent]=useState<any[]>([]);
  



 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewPostContent((prev) => ({
    ...prev,
    content: e.target.value,
  }));
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('content', newPostContent.content);
    if (newPostContent.image) {
      formData.append('image', newPostContent.image);
    }

    await api.addpost(formData); // ⚠️ modifie aussi `api.addpost` (voir ci-dessous)

    setNewPostContent({
      content: '',
      image: null,
    });
  } catch (err) {
    console.error(err);
  }
};


  const fetchdata = async () => {
    try {
      const res = await api.getposts();
     const token = localStorage.getItem('token');

      const eventlist = await api.fetchMyEvents(token);

       const profilres = await api.getuserprofil();
              setProfile(profilres.data);
              const userId = profilres.data._id;
              const postsWithLikeState = res.data.map((post: any) => ({
  ...post,
  liked: post.likes.includes(userId),
  likes: post.likes.length,
}));
setposts(postsWithLikeState);
setevent(eventlist);


    } catch (err) {
    } finally {
    }
  };
useEffect(() => {
    fetchdata();
  }, []);





  const handleNavigationClick = (page: string) => {
    console.log(`Bouton de navigation '${page}' cliqué!`);
    // Ici, vous géreriez la navigation (ex: avec react-router-dom)
  };

const handleLikeClick = async (postId: string) => {
  try {
    const res = await api.addlike(postId);
    
    // Met à jour le post correspondant dans le tableau des posts
    setposts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              liked: res.data.liked,
              likes: res.data.likeCount,
            }
          : post
      )
    );
  } catch (error) {
    console.error("Erreur lors du like :", error);
  }
};


  const handleCommentClick = () => {
    console.log("Bouton 'Comentar' cliqué!");
    // Ici, vous ouvririez un champ de commentaire ou une section de commentaires
  };

  const handleShareClick = (postId: string) => {
  setSelectedPostId(postId);
  setShareModalOpen(true);
};

const handleShareSubmit = async (content: string, postId: string) => {
  try {
    await api.SharePost(postId, { content });
    await fetchdata(); // pour rafraîchir les posts
  } catch (err) {
    console.error("Erreur de partage", err);
  }
};


const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await api.logout();
    localStorage.removeItem("userRole");
    navigate("/login"); 
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

 if (!profile) {
    return <div className="text-center mt-10 text-gray-500">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter"> {/* Added font-inter class */}
    
      {/* Header */}
    
    <header className="bg-white shadow-md px-4 py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        
        <div className="flex items-center space-x-3">
                    <span className="text-blue-600 font-medium">Home</span>        

        <Link
                      to="/profile"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Profile
                    </Link>
         </div>
        
        

        {/* Navigation icônes centrales */}
        <nav className="flex space-x-8 text-gray-600">
          <button
  className="hover:text-blue-600 transition-colors"
  onClick={() => navigate(0)} 
>
  <HomeIcon className="w-6 h-6" />
</button>
          <button className="hover:text-blue-600 transition-colors">
            <Users className="w-6 h-6" />
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Video className="w-6 h-6" />
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Store className="w-6 h-6" />
          </button>
        </nav>

        {/* Actions à droite */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-blue-600 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  


      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Card */}
          <Card className="rounded-xl shadow-md"> {/* Added rounded and shadow */}
            <CardHeader className="text-center p-6 pb-2"> {/* Added padding */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                   
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-gray-900">
                        Homie services
                      </h2>
                      
                    </div>
                  </div>
                </div>
               
              </div>
           

              {/* Navigation */}
              <div className="flex gap-4 text-sm border-b pb-2 mb-4 overflow-x-auto whitespace-nowrap"> {/* Added overflow and whitespace */}
                <button
                  className="border-b-2 border-blue-600 text-blue-600 pb-2 font-medium"
                  onClick={() => handleNavigationClick("Página inicial")}
                >
                  Videos
                </button>
                <button
                  className="text-gray-600 hover:text-blue-600 pb-2 transition-colors"
                  onClick={() => handleNavigationClick("Créditos")}
                >
                  Stories
                </button>

                <a
                  className="text-gray-600 hover:text-blue-600 pb-2 transition-colors"
                   href="/events"
                >
                  All Events
                </a>
                <button
                  className="text-gray-600 hover:text-blue-600 pb-2 transition-colors"
                  onClick={() => handleNavigationClick("Fotos")}
                >
                  Assistant IA
                </button>
               
              </div>
            </CardHeader>
          </Card>

    <div className="flex items-center justify-center gap-2 mb-2 ml-7">
  <button
    onClick={() => document.getElementById("open-modal")?.click()}
    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
  >
    <span>Create your event</span>
  </button>

  <CreateEventModal />
</div>



          {/* About Section */}
                     {event.map((ev) => (

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row justify-between items-center p-6 pb-2"> {/* Adjusted for better alignment */}
              <h3 className="font-semibold text-gray-900 text-lg">{ev.title}</h3>
              <a href={`/event/${ev._id}`} className="text-blue-600 text-sm hover:underline" >
                show details
              </a>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4"> {/* Adjusted padding */}
              {/* Map placeholder */}
              <div className="h-32 bg-green-100 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-500">
                {/* Replaced generic div with placeholder image for map */}
               { ev.image && (
          <img src={`http://localhost:5000/uploads/${ev.image}`} className="w-full h-48 object-cover" />
        )} 
                
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>
                    {ev.description}
                  </span>
                </div>
                
              
              </div>
            </CardContent>
          </Card>
                     ))}
<div>
                       <Geminimodal />

</div>
        </div>


        {/* Right Column - Posts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Post Section */}
          <Card className="rounded-xl shadow-md">
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
     <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
    <img
                src={profile.avatar ? `http://localhost:5000/uploads/${profile.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />               
                  </Avatar>

      <Input
        type="text"
        placeholder="What's on your mind ?"
        value={newPostContent.content}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e);
          }
        }}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 border-none"
      />

      {/* Icône d'ajout d'image */}
      <div className="relative">
        <label htmlFor="file-upload" className="cursor-pointer text-gray-500 hover:text-blue-600">
          <ImageIcon className="w-5 h-5" />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewPostContent((prev) => ({
              ...prev,
              image: e.target.files?.[0] || null,
            }))
          }
          className="hidden"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 ml-2"
      >
        Publier
      </Button>
    </div>
  </CardContent>
</Card>


          {/* FOXSPEED Post */}
           {posts.map((post) => (
    <div
      key={post._id}
      className="w-full bg-white shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden"
    >
          <Card className="rounded-xl shadow-md">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
    <img
                src={post.author?.avatar ? `http://localhost:5000/uploads/${post.author?.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />               
                  </Avatar>
               <div>
                    <p className="font-semibold">{post.author?.nom}</p>
<p className="text-sm text-gray-500">
  {new Date(post.createdAt).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} 🌍
</p>
                  </div>
              </div>
            </CardHeader>
           <CardContent className="p-6 pt-2 space-y-4">

            
  {/* Si c'est un post partagé */}
  {post.sharedFrom ? (
    <>
      <p className="text-gray-900">{post.content}</p>



 <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
    <img
                src={post.sharedFrom?.author ? `http://localhost:5000/uploads/${post.sharedFrom?.author?.avatar}` : 'https://placehold.co/800x200'}
                alt="Cover"
              />               
                  </Avatar>
               <div>
      <p className="font-semibold"> {post.sharedFrom?.author?.nom} </p>
         </div>
              </div>
            </CardHeader>

      {/* Post original partagé */}
      <div className="border rounded p-3 mt-2 bg-gray-50">
        <p className="text-gray-900">{post.sharedFrom?.content}</p>

        {post.sharedFrom?.image && (
          <img
            src={`http://localhost:5000/uploads/${post.sharedFrom.image}`}
            alt="shared"
            className="mt-2 rounded w-full max-h-60 object-cover"
          />
        )}
      </div>
    </>
  ) : (
    <>
      {/* Post normal */}
      <div className="flex items-center gap-2 mb-1 p-4">
        <div className="bg-green-100 text-green-600 p-1 rounded-full" />
        <h5 className="text-lg font-semibold text-gray-800">{post.content}</h5>
      </div>

      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt="post"
          className="w-full h-40 object-cover rounded"
        />
      )}
    </>
  )}

  {/* Social Actions */}
  <Separator className="my-4" />
  <div className="flex items-center justify-around py-2">
    <Button
      variant="ghost"
      onClick={() => handleLikeClick(post._id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
        post.liked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      <ThumbsUp
        className={`w-5 h-5 transition-transform duration-200 ${
          post.liked ? 'fill-blue-600 scale-110' : 'fill-none'
        }`}
      />
      <span className="font-medium">{post.liked ? "J'aime" : 'Like'}</span>
      <span
        className={`text-xs ml-1 rounded-full px-2 py-0.5 ${
          post.liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {post.likes}
      </span>
    </Button>

    <Button
      variant="ghost"
      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg"
      onClick={() => handleShareClick(post._id)}
    >
      <Share className="w-4 h-4" />
      <span>Partager</span>
    </Button>
  </div>

  {/* Commentaire */}
  <CommentSection postId={post._id} />
</CardContent>


          </Card>
           </div>
  ))}
        </div>


          {/* Right Column - Users List */}
<div className="hidden xl:block space-y-4">
  <UsersListPage />
</div>

  
      </div>
      {selectedPostId && (
  <ModalShare
    open={shareModalOpen}
    onClose={() => setShareModalOpen(false)}
    onSubmit={handleShareSubmit}
    postId={selectedPostId}
  />
)}

    </div>
    
  );
};

export default Home;
