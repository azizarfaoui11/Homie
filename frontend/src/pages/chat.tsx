import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

//const socket = io('http://localhost:5000');

export default function ChatPage({ recipientId }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.id;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recipient, setRecipient] = useState<any>(null);


  /*useEffect(() => {
    if (!currentUserId || !recipientId) return;

    api.getMessages(currentUserId, recipientId).then((res) => {
      setMessages(res.data);
    });


    socket.on('receiveMessage', (msg) => {
      const isRelated =
        (msg.sender === currentUserId && msg.receiver === recipientId) ||
        (msg.sender === recipientId && msg.receiver === currentUserId);

      if (isRelated) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUserId, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const msg = {
      sender: currentUserId,
      receiver: recipientId,
      content: message,
    };
    await api.SendMessage(msg);
    socket.emit('sendMessage', msg);
    //setMessages((prev) => [...prev, msg]);
    setMessage('');
  };


*/
const handleSend=()=>{

}

  useEffect(() => {
  if (!recipientId) return;

  api.getUserById(recipientId).then((res) => {
    setRecipient(res.data);
  });
}, [recipientId]);

  return (
    <div className="p-3">
      <Card className="rounded-2xl shadow-lg p-4 bg-white border border-gray-200">

{/* Header de la conversation */}
{recipient && (
  <div className="flex items-center gap-3 mb-4">
    {/* Avatar */}
    <div className="relative">
      <img
        src={`http://localhost:5000/uploads/${recipient.avatar}`}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border"
      />
      {/* Cercle de statut */}
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          recipient.isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </div>

    {/* Nom de l'utilisateur */}
    <div>
      <p className="text-sm font-medium text-gray-800">{recipient.username}</p>
      <p className="text-xs text-gray-500">
        {recipient.isOnline ? 'En ligne' : 'Hors ligne'}
      </p>
    </div>
  </div>
)}


        {/* Zone des messages */}
        <div className="h-80 overflow-y-auto space-y-2 pr-1 mb-4 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
                  msg.sender === currentUserId
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tape ton message..."
            className="flex-1 bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <Button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Envoyer
          </Button>
        </div>
      </Card>
    </div>
  );
}
