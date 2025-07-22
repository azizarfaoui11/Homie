import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";

export default function CreateEventModal() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("date", form.date);
    data.append("location", form.location);
    if (form.image) data.append("image", form.image);

    try {
      await api.addEvent(data);
      window.location.reload(); // ou appeler un refetch si tu as un système de fetch
    } catch (err) {
      console.error("Erreur création événement", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 transition-all">
          <Plus className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Créer un événement</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Titre</label>
            <input
              name="title"
              placeholder="Ex: Hackathon Étudiant"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
             placeholder="Décrivez l’événement..."
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="datetime-local"
              name="date"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lieu</label>
            <input
              name="location"
             placeholder="Ex: Tunis, Coworky Space"

              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Affiche</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
