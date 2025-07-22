import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Camera, Image } from 'lucide-react';

interface Props {
  onClose: () => void;
}

// ... imports inchangés

interface UserProfile {
  _id: string;
  nom: string;
  telephone?: string;
  bio?: string;
  location?: string;
  birthdate?: string;
  gender?: 'homme' | 'femme';
  avatar?: string;
  coverPhoto?: string;
  occupation?: string;
  hobbies?: string;
}

export default function EditProfile({ onClose }: Props) {
  const [user, setUser] = useState<UserProfile>({
    _id: '',
    nom: '',
    telephone: '',
    bio: '',
    location: '',
    birthdate: '',
    gender: 'homme',
    avatar: '',
    coverPhoto: '',
    occupation: '',
    hobbies: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getuserprofil();
        setUser(res.data);
      } catch (err) {
        console.error("Erreur récupération profil :", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      type === 'avatar' ? setAvatarFile(file) : setCoverFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('nom', user.nom);
      if (user.telephone) formData.append('telephone', user.telephone);
      if (user.bio) formData.append('bio', user.bio);
      if (user.location) formData.append('location', user.location);
      if (user.birthdate) formData.append('birthdate', user.birthdate);
      if (user.gender) formData.append('gender', user.gender);
      if (user.occupation) formData.append('occupation', user.occupation);
      if (user.hobbies) formData.append('hobbies', user.hobbies);
      if (avatarFile) formData.append('avatar', avatarFile);
      if (coverFile) formData.append('coverPhoto', coverFile);

      await api.updateUser(user._id, formData);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Modifier votre profil</h2>

          {/* Cover Photo */}
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={user.coverPhoto ? `http://localhost:5000/uploads/${user.coverPhoto}` : 'https://placehold.co/800x200'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <label htmlFor="cover-upload" className="absolute top-2 right-2 bg-white/70 hover:bg-white p-1 rounded-full cursor-pointer shadow-md">
              <Image className="w-5 h-5 text-gray-700" />
            </label>
            <Input id="cover-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
          </div>

          {/* Avatar + Nom */}
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <img
                src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://placehold.co/800x200'}
                alt="Avatar"
                className="rounded-full w-24 h-24 object-cover border"
              />
              <label htmlFor="avatar-upload" className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 rounded-full shadow-md cursor-pointer">
                <Camera className="w-4 h-4 text-gray-700" />
              </label>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
            </div>
            <div className="flex-1">
              <Label htmlFor="nom">Nom</Label>
              <Input name="nom" value={user.nom} onChange={handleChange} />
            </div>
          </div>

          {/* Champs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input name="telephone" value={user.telephone || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input name="location" value={user.location || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="birthdate">Date de naissance</Label>
              <Input type="date" name="birthdate" value={user.birthdate?.slice(0, 10) || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="gender">Genre</Label>
              <select name="gender" value={user.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>

          {/* Nouveaux champs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occupation">Profession</Label>
              <Input name="occupation" value={user.occupation || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="hobbies">Hobbies</Label>
              <Input name="hobbies" value={user.hobbies || ''} onChange={handleChange} placeholder="Musique, sport..." />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea name="bio" value={user.bio || ''} onChange={handleChange} placeholder="Parlez un peu de vous..." className="min-h-[100px]" />
          </div>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

