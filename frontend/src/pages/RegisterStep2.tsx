import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../services/api";
import { motion } from "framer-motion";


export default function RegisterStep2() {
  const navigate = useNavigate();
  const [step1Data, setStep1Data] = useState<any>(null);
  const [formData, setFormData] = useState({
    birthdate: "",
    gender: "",
    avatar: null as File | null,
    coverPhoto: null as File | null,
    location: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("registerStep1");
    if (!stored) return navigate("/register-step1");
    setStep1Data(JSON.parse(stored));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        setFormData((prev) => ({ ...prev, location: coords }));
      },
      (err) => console.error("Erreur géolocalisation", err)
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Data) return;

    const data = new FormData();
    Object.entries({ ...step1Data, ...formData }).forEach(([key, value]) => {
      if (value) data.append(key, value as string | Blob);
    });

    try {
      await api.register(data);
      localStorage.removeItem("registerStep1");
      setSuccessMessage("Inscription réussie !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Erreur lors de l’inscription.");
      console.error(err);
    }
  };

  return (
<motion.div
  className="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ duration: 0.5 }}
>  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden h-full">
    <div className="flex flex-col lg:flex-row h-full">
          {/* Illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-indigo-400 to-indigo-600 p-8 lg:p-12 flex items-center justify-center relative h-full">
            <div className="text-center text-white relative z-10">
              <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-6 relative">
                <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-6xl lg:text-8xl">📸</div>
                </div>
                <div className="absolute -top-4 -left-8 bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold transform -rotate-12">
                  Almost there!
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Final step</h2>
              <p className="text-indigo-100 text-lg">Let's finish your profile</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Inscription (2/2)</h2>

              {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
              {successMessage && <p className="text-green-600 text-sm text-center mb-2">{successMessage}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo de couverture
                  </label>
                  <input
                    type="file"
                    name="coverPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Créer le compte
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

  );
}
