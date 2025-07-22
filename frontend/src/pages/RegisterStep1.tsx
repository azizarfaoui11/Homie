import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Role } from "../services/api";
import { motion } from "framer-motion";


export default function RegisterStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    role: Role.USER,
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (
      !formData.nom ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.telephone
    ) {
      setError("Tous les champs sont requis.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    localStorage.setItem("registerStep1", JSON.stringify(formData));
    navigate("/register-step2");
  };

  return (
<motion.div
  className="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.5 }}
>  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden h-full">
    <div className="flex flex-col lg:flex-row h-full">
          {/* Illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-indigo-400 to-indigo-600 p-8 lg:p-12 flex items-center justify-center relative h-full">
            <div className="text-center text-white relative z-10">
              <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-6 relative">
                <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-6xl lg:text-8xl">📝</div>
                </div>
                <div className="absolute -top-4 -left-8 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold transform -rotate-12">
                  Let's Register!
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Join the Homie Club!</h2>
              <p className="text-indigo-100 text-lg">Step 1 of 2</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center h-full">
          
            <div className="w-full max-w-md">
                 <div className="flex justify-end mb-4">
                  <div className="flex gap-4">
                    
                 <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                              >
                                Login ←
                              </Link>
                              </div>

                              </div>
              <h2 className="text-2xl font-bold mb-6 text-center"> 1/2</h2>

              {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

              <div className="space-y-4">
                <Input
                  label="Nom complet"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  icon={<FaIcons.FaUser className="text-gray-500 mr-2" />}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<FaIcons.FaEnvelope className="text-gray-500 mr-2" />}
                />
                <Input
                  label="Mot de passe"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<FaIcons.FaLock className="text-gray-500 mr-2" />}
                />
                <Input
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<FaIcons.FaLock className="text-gray-500 mr-2" />}
                />
                <Input
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  icon={<FaIcons.FaPhone className="text-gray-500 mr-2" />}
                />
              </div>

              <Button
                onClick={handleNext}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Suivant →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

  );
}

// Champ avec icône intégré
const Input = ({ label, icon, ...props }: any) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center border border-gray-200 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
      {icon}
      <input
        {...props}
        className="w-full p-2 outline-none bg-transparent text-sm"
        required
      />
    </div>
  </div>
);
