import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { AuthRequest } from '../middlewares/auth'; // req.user.userId
import { Types } from 'mongoose';

// 1. Créer un événement
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location } = req.body;
    const organizer = req.user?.userId;
    const image = req.file?.filename; // ou path complet si besoin

    const event = new Event({
      title,
      description,
      date,
      location,
      image: image,
      organizer,
      participants: [organizer],
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l’événement' });
  }
};

// 2. Obtenir tous les événements
export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().populate('organizer', 'nom telephone').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
};

// 3. Obtenir un événement par ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'nom telephone')
    .populate('participants', 'nom avatar telephone');
    if (!event) 
        {res.status(404).json({ message: 'Événement non trouvé' });
return;} 

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’événement' });
  }
};

// 4. Participer à un événement
export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) 
    {
         res.status(404).json({ message: 'Événement non trouvé' });
         return;
    }

    const userId = req.user?.userId;
   const user= new Types.ObjectId(userId);
    if (!event.participants.includes(user)) {
      event.participants.push(user);
      await event.save();
    }

    res.json({ message: 'Participation enregistrée', participants: event.participants });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la participation' });
  }
};

// 5. Se désinscrire
export const leaveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) 
      { res.status(404).json({ message: 'Événement non trouvé' });
    return;
}  

    const userId = req.user?.userId;
    event.participants = event.participants.filter((id) => id.toString() !== userId);
    await event.save();

    res.json({ message: 'Désinscription réussie', participants: event.participants });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la désinscription' });
  }
};


export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getEventByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const event = ((await Event.find({ participants: userId })
    .populate('organizer', 'nom telephone')
    .populate('participants', 'nom avatar telephone')
    
    ));
      
        
  
      res.status(200).json(event);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération de mes evenements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };