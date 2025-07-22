// pages/Events/EventsList.tsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import  {event}  from '../services/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {  Users } from 'lucide-react';

export default function EventsList() {
  const [events, setEvents] = useState<event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getEvents();
        setEvents(res.data);
      } catch (err) {
        console.error('Erreur chargement événements', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events.map(event => (
        <Card className="rounded-xl shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center p-6 pb-2"> {/* Adjusted for better alignment */}
                      <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                      <a href={`/event/${event._id}`}className="text-blue-600 text-sm hover:underline" >
                                                 <span>🌐</span>
 show details
                      </a>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 space-y-4"> {/* Adjusted padding */}
                      {/* Map placeholder */}
                      <div className="h-32 bg-white-100 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-500">
                        {/* Replaced generic div with placeholder image for map */}
 {event.image && (
          <img src={`http://localhost:5000/uploads/${event.image}`} className="w-full h-48 object-cover" />
        )}                        <div className="absolute inset-0 bg-white-200 opacity-50"></div>
                        <button 
                          className="absolute bottom-2 left-2 bg-white rounded px-2 py-1 text-xs shadow-md flex items-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          📍{ event.location}                          <br />
                        </button>
                      </div>
        
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📍</span>
                          {event.description}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-purple-500" /> {/* Added color to icon */}
                          <span>200 c'est le nombre de place</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📞</span>
                          <span>{event.organizer.telephone}</span>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
      ))}
    </div>
  );
}
