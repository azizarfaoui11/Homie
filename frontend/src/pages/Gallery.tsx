import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';

export default function Gallery() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [postImages, setPostImages] = useState<string[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getImages = async () => {
      try {
        const { images } = await api.fetchMyImages(token);
       // setAvatar(avatar);
        //setCoverPhoto(coverPhoto);
        setPostImages(images || []);
      } catch (err) {
        console.error('Erreur récupération images :', err);
      }
    };
    getImages();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📷 Ma Galerie</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {avatar && (
          <Card className="overflow-hidden shadow-md">
            <img
              src={`http://localhost:5000/uploads/${avatar}`}
              alt="Avatar"
              className="w-full h-48 object-cover"
            />
            <CardContent className="text-center text-sm text-gray-600 mt-2">Avatar</CardContent>
          </Card>
        )}

        {coverPhoto && (
          <Card className="overflow-hidden shadow-md">
            <img
              src={`http://localhost:5000/uploads/${coverPhoto}`}
              alt="Photo de couverture"
              className="w-full h-48 object-cover"
            />
            <CardContent className="text-center text-sm text-gray-600 mt-2">Photo de couverture</CardContent>
          </Card>
        )}

        {postImages.map((img, index) => (
          <Card key={index} className="overflow-hidden shadow-md">
            <img
              src={`http://localhost:5000/uploads/${img}`}
              alt={`Post ${index}`}
              className="w-full h-48 object-cover"
            />
            <CardContent className="text-center text-sm text-gray-600 mt-2">
              Photo {index + 1}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
