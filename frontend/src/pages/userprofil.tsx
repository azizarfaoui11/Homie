import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const profilres = await api.getuserprofil();
        setProfile(profilres.data);
         const token = localStorage.getItem('token');
        if (token) {
          const postsRes = await api.fetchMyPosts(token);
          setPosts(postsRes); // Si postsRes est un tableau
        }
      } catch (err) {
        console.error('Erreur chargement profil', err);
      }
    };
    fetchData();
  }, []);

  if (!profile) {
    return <div className="text-center mt-10 text-gray-500">Chargement du profil...</div>;
  }


  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profil Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={profile.coverPhoto ? `http://localhost:5000/uploads/${profile.coverPhoto}` : 'https://placehold.co/800x200'}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <img
              src={profile.avatar ? `http://localhost:5000/uploads/${profile.avatar}` : 'https://placehold.co/100x100'}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.nom}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>
        <div className="pt-16 px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Genre :</strong> {profile.gender || 'Non spécifié'}</p>
            <p><strong>Date de naissance :</strong> {profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Téléphone :</strong> {profile.telephone}</p>
            <p><strong>Localisation :</strong> {profile.location || 'N/A'}</p>
            <p><strong>Rôle :</strong> {profile.role}</p>
            <p><strong>Inscription :</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Bouton modifier */}
          <div className="mt-6 text-right">
            <Link
              to="/edit-profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Modifier mon profil
            </Link>
          </div>
        </div>
         {/* Liste des publications */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Mes publications</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">Aucune publication pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white shadow rounded-lg p-4">
                <h4 className="text-lg font-bold">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
                <p className="text-sm text-gray-400">Publié le {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Liste des publications */}
     
    </div>
  );
}
