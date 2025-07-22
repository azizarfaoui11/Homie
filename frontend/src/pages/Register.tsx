import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import * as FaIcons from 'react-icons/fa';
import {api} from '../services/api'
import {Role} from '../services/api'


const Register = () =>{
  const navigate = useNavigate();



  
  
  const [formData, setFormData] = useState({
  nom: '',
  email: '',
  password: '',
  confirmPassword: '',
  telephone: '',
  role: Role.USER,
  birthdate: '',
  gender: '',
   avatar: null as File | null,
  coverPhoto: null as File | null,
  location: ''
});


const FaUser = FaIcons.FaUser as React.FC<React.SVGProps<SVGSVGElement>>;
const FaEnvelope = FaIcons.FaEnvelope as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLock = FaIcons.FaLock as React.FC<React.SVGProps<SVGSVGElement>>;
const FaWallet = FaIcons.FaWallet as React.FC<React.SVGProps<SVGSVGElement>>;

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, files } = e.target;
  if (files && files.length > 0) {
    setFormData((prev) => ({
      ...prev,
      [name]: files[0]
    }));
  }
};


 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {

      const data = new FormData();
data.append('nom', formData.nom);
data.append('email', formData.email);
data.append('password', formData.password);
data.append('role', formData.role);
data.append('telephone', formData.telephone);
data.append('birthdate', formData.birthdate);
data.append('gender', formData.gender);
data.append('location', formData.location);
if (formData.avatar) data.append('avatar', formData.avatar);
if (formData.coverPhoto) data.append('coverPhoto', formData.coverPhoto);

await api.register(data);
      setSuccessMessage('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      setFormData((prev) => ({ ...prev, location: coords }));
    },
    (error) => console.error("Erreur de géolocalisation", error),
    { enableHighAccuracy: true }
  );
}, []);


  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    console.log("Facebook login clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Character illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 p-8 lg:p-12 flex items-center justify-center relative">
            <div className="text-center text-white relative z-10">
              {/* Character illustration placeholder - you can replace with actual illustration */}
              <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-6 relative">
                <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-6xl lg:text-8xl">👋</div>
                </div>
                {/* Hello speech bubble */}
                <div className="absolute -top-4 -left-8 bg-orange-400 text-orange-900 px-4 py-2 rounded-full text-sm font-semibold transform -rotate-12">
                  Hello homie!
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Welcome Back!
              </h2>
              <p className="text-blue-100 text-lg">
                Sign up to continue to your account
              </p>
            </div>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/2 right-10 w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="w-full max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                </div>
                <div className="flex justify-end mb-4">
                  <div className="flex gap-4">
                    
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Login →
                    </Link>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  ut lorem vehicula, tempor lorem at, tempor lorem at porta
                  vehicula.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>
       


          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numero de tel</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaWallet className="text-gray-500 mr-2" />
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
            </div>


            {/* Date de naissance */}
<div>
  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
  <input
    type="date"
    name="birthdate"
    value={formData.birthdate}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg focus:outline-none"
  />
</div>

{/* Genre */}
<div>
  <label className="block text-sm font-medium text-gray-700">Genre</label>
  <select
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg focus:outline-none"
  >
    <option value="">Sélectionner</option>
    <option value="homme">Homme</option>
    <option value="femme">Femme</option>
    <option value="autre">Autre</option>
  </select>
</div>

{/* Avatar URL */}
<div>
  <label className="block text-sm font-medium text-gray-700">Avatar</label>
  <input
    type="file"
    name="avatar"
    accept="image/*"
    onChange={handleFileChange}
    className="w-full p-2 border rounded-lg"
  />
</div>

{/* Cover Photo */}
<div>
  <label className="block text-sm font-medium text-gray-700">Photo de couverture</label>
  <input
    type="file"
    name="coverPhoto"
    accept="image/*"
    onChange={handleFileChange}
    className="w-full p-2 border rounded-lg"
  />
</div>


               
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Register
                </Button>

                {/* Social Login */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    <span>Sign up with Facebook</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
