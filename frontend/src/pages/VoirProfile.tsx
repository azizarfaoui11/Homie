import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; // Import Input component

import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Phone,
  Mail,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share,
  Edit,
  Settings,
  ImageIcon,
  LogOut,
  Bell,
  MessageSquare,
  Store,
  Video,
  Home,
  Search,
} from "lucide-react";
import { api } from "@/services/api";
import CommentSection from "@/components/commentsection";
import FollowButton from "@/components/FollowButton";
import SearchModal from "@/components/SearchModal";



const VoirProfile = () => {
  const [activeTab, setActiveTab] = useState("post");
  
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
 
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [newPostContent, setNewPostContent] = useState ({
  content:'',
    image: null as File | null,
  
  
    });
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = localStorage.getItem('token');
  const [postImages, setPostImages] = useState<string[]>([]);
    
    const [friends, setFriends] = useState<any>([]);
    const { id } = useParams(); // récupère le userId depuis l'URL
  const [isSearchOpen, setIsSearchOpen] = useState(false);




   
  



const navigate = useNavigate();

const handleCloseModal = () => {
  setOpenModal(false);
  setRefreshKey(prev => prev + 1); // 🔁 déclenche le rechargement
};



useEffect(() => {
    const fetchData = async () => {
      try {
        const profilres = await api.getUserById(id);
        setProfile(profilres.data);
        if (id) {
          const postsRes = await api.fetchPostByuser(id);
          const userId = profilres.data._id;
const enrichedPosts = postsRes.map((post) => ({
  ...post,
  liked: post.likes.includes(userId),
  likeCount: post.likes.length,
}));

setPosts(enrichedPosts);
}
      } catch (err) {
        console.error('Erreur chargement profil', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  
useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.getusers();
        setFriends(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFriends();
  }, []);

  
   

 
  const handleLikeClick = async (postId: string) => {
  try {
    const res = await api.addlike(postId);

    // Met à jour uniquement le post concerné
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              liked: res.data.liked,
              likeCount: res.data.likeCount,
            }
          : post
      )
    );
  } catch (error) {
    console.error("Erreur like", error);
  }
};

const handleShareClick = () => {
    console.log("Bouton 'Partilhar' cliqué!");
    // Ici, vous activeriez la fonctionnalité de partage
  };


const handleLogout = async () => {
  try {
    await api.logout();
    localStorage.removeItem("userRole");
    navigate("/login"); 
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

useEffect(() => {
      const getImages = async () => {
        try {
          const { images } = await api.fetchImagesByuser(id);
          setPostImages(images || []);
        } catch (err) {
          console.error('Erreur récupération images :', err);
        }
      };
      getImages();
    }, [token]);


  if (!profile) {
    return <div className="text-center mt-10 text-gray-500">Chargement du profil...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <header className="bg-white shadow-md px-4 py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
                      <span className="text-blue-600 font-medium">Profile</span>       

 <Link
              to="/home"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>



 </div>
        
          

        {/* Navigation icônes centrales */}
        <nav className="flex space-x-8 text-gray-600">
 <button
  className="hover:text-blue-600 transition-colors"
  onClick={() => navigate(0)} 
>            <Home className="w-6 h-6" />
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Users className="w-6 h-6" />
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Video className="w-6 h-6" />
          </button>
             <button
              className="hover:text-blue-600 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
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
  

      {/* Header Banner */}
      <div className="relative">
         <img
            src={profile.coverPhoto ? `http://localhost:5000/uploads/${profile.coverPhoto}` : 'https://placehold.co/800x200'}
            alt="Cover"
            className="w-full h-80 object-cover"
          />

        {/* Profile Section */}
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 -mt-24 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
<img
            src={profile.avatar ? `http://localhost:5000/uploads/${profile.avatar}` : 'https://placehold.co/800x200'}
            alt="Cover"
            className="w-full h-48 object-cover"
          />               
              </Avatar>

              <div className="text-center lg:text-left">
               <h2 className="text-3xl font-bold text-gray-900 mb-2">
{
  profile.nom
}                </h2>
                
              </div>
               
            </div>

            <div className="flex gap-3 ml-12">
            <FollowButton targetId={profile._id} currentUserId={""}  />

              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                "Post",
                "About",
                "Photos",
                "Videos",
                "Reels",
                "More",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.toLowerCase()
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Intro */}
         <Card>
  <CardHeader>
    <h3 className="font-semibold text-gray-900">Intro</h3>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-sm text-gray-700">{profile.bio || "Aucune bio pour le moment"}</p>

    <div className="flex items-center gap-3 text-sm text-gray-600">
      <MapPin className="w-4 h-4" />
      <span>{profile.location || "Lieu non spécifié"}</span>
    </div>

    <div className="flex items-center gap-3 text-sm text-gray-600">
      <Mail className="w-4 h-4" />
      <span>{profile.email}</span>
    </div>

    {profile.birthdate && (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        🎂 <span>{new Date(profile.birthdate).toLocaleDateString()}</span>
      </div>
    )}

    

    {profile.occupation && (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Briefcase className="w-4 h-4" />
        <span>{profile.occupation}</span>
      </div>
    )}

    {profile.hobbies && profile.hobbies.length > 0 && (
      <div>
        <h4 className="text-sm font-medium">Centres d’intérêts :</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          {profile.hobbies.map((hobby, idx) => (
            <li key={idx}>{hobby}</li>
          ))}
        </ul>
      </div>
    )}

    
  </CardContent>
</Card>





          {/* Photos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-gray-900">Photos</h3>
              <Link to={`/gallery`} className="text-blue-500 hover:underline">
  Voir tous les photos  📸
</Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                 {postImages.map((img, index) => (
          <Card key={index} className="overflow-hidden shadow-md">
            <img
              src={`http://localhost:5000/uploads/${img}`}
              alt={`Post ${index}`}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            />
            
          </Card>
        ))}
              </div>

              {/* Photo Modal */}
              {selectedPhoto && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <div className="relative max-w-4xl max-h-full p-4">
                    <img
                      src={selectedPhoto}
                      alt="Selected photo"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Friends */}
         
 <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Friends</h3>
                <p className="text-sm text-gray-500">4,934 friends</p>
              </div>
              <button className="text-blue-600 text-sm hover:underline">
                See All Friends
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {friends.map((friend) => (
                  <div className="text-center">
                    <Avatar
                      className={`w-20 h-20 mx-auto mb-2 `}
                    >
                        <img
              src={friend?.avatar ? `http://localhost:5000/uploads/${friend?.avatar}` : 'https://placehold.co/60x60'}
              alt="Avatar"
            />
                    </Avatar>
                    <p className="text-xs font-medium text-gray-900 leading-tight">
                      {friend?.nom}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          





          {/* Post */}
          {posts.map((post) => (
    <div
      key={post._id}
      className="w-full bg-white shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden"
    >
          <Card>
            
            <CardHeader>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
<img
            src={profile.avatar ? `http://localhost:5000/uploads/${profile.avatar}` : 'https://placehold.co/800x200'}
            alt="Cover"
          />               
              </Avatar>

                  <div>
                    <p className="font-semibold">{profile.nom}</p>
<p className="text-sm text-gray-500">
  {new Date(post.createdAt).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} 🌍
</p>                  </div>
                </div>
                <div className="flex gap-2">
                 
                  <Button variant="outline" size="sm">
                    ⚙ Manage post
                  </Button>
                </div>
              </div>
            </CardHeader>



            <CardContent className="space-y-4">



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
  <span className={`text-xs ml-1 rounded-full px-2 py-0.5 ${
    post.liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
  }`}>
    {post.likeCount}
  </span>
</Button>



       
        <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg" onClick={handleShareClick}>
          <Share className="w-4 h-4" />
          <span>Partager</span>
        </Button>
      </div>

           <CommentSection postId={post._id} />


            </CardContent>
          </Card>
          </div>
          ))}
        </div>
      </div>
                    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </div>
  );
};



export default VoirProfile;
