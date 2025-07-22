import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { event } from '../services/api';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<event | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getEventById(id!);
        setEvent(res.data);
      } catch (err) {
        console.error('Erreur chargement événement', err);
      }
    };
    fetch();
  }, [id]);

  const handleJoin = async () => {
    await api.joinEvent(id!);
    location.reload();
  };

  const handleLeave = async () => {
    await api.leaveEvent(id!);
    location.reload();
  };

  if (!event) return <p className="text-center mt-10 text-gray-500">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Colonne gauche : Événement */}
      <div className="lg:col-span-2 space-y-4">
        <img
          src={`http://localhost:5000/uploads/${event.image}`}
          className="w-full h-64 object-cover rounded-2xl shadow"
          alt="Event"
        />
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleString()}</p>
        <p className="text-lg text-gray-800">{event.description}</p>
        <p className="text-sm text-gray-600">📍 {event.location}</p>

        <div className="flex gap-4 mt-6">
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow"
            onClick={handleJoin}
          >
            Participer
          </button>
          <button
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow"
            onClick={handleLeave}
          >
            Quitter
          </button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm flex items-center gap-3">
  <span className="text-xl">📞</span>
  <div className="text-sm text-gray-800">

    <p className="font-semibold">Pour plus d informations contactez organisateur :</p>
    <p>{event.organizer.telephone}</p>
  </div>
</div>
      </div>

      {/* Colonne droite : Participants */}
      <div className="bg-white rounded-2xl shadow p-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Participants :  {event.participants.length}</h3>
        <ul className="space-y-3">
          {event.participants.map((user, index) => (
            <li key={index} className="flex items-center gap-3">
              {user.avatar && (
                <img
                  src={`http://localhost:5000/uploads/${user.avatar}`}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border"
                />
              )}
              <span className="text-gray-700 font-medium">{user.nom}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
