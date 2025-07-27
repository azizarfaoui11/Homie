import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();


  useEffect(() => {
    if (query.trim()) {
      api.getusers().then(res => {
        const users = res.data.filter(
          (u: any) =>
            u._id !== currentUser.id &&
            u.nom.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(users);
      });
    } else {
      setFilteredUsers([]);
    }
  }, [query]);


   const handleViewProfile = (userId: string) => {
    onClose(); // Fermer le modal
    navigate(`/voirprofile/${userId}`); // Rediriger vers la page de profil
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            🔍 Rechercher un utilisateur
          </Dialog.Title>

          <Input
            placeholder="Nom de l'utilisateur..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
            {filteredUsers.map((user: any) => (
              <Card
                key={user._id}
                className="p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border">
                    <img
                      src={
                        user.avatar
                          ? `http://localhost:5000/uploads/${user.avatar}`
                          : "https://placehold.co/100x100"
                      }
                      alt={user.nom}
                    />
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.nom}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
              size="sm"
              variant="secondary"
              onClick={() => handleViewProfile(user._id)}
            >
              Voir Profil
            </Button>
              </Card>
            ))}
            {query && filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Aucun utilisateur trouvé.
              </p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
