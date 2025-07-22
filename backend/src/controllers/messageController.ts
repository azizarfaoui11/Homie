import { AuthRequest } from '../middlewares/auth';
import {Message} from '../models/message';
import { Request, Response } from 'express';

export const sendMessage = async (req: Request, res: Response) => {
  const { sender, receiver, content } = req.body;

  /*const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }*/
  try {
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};  

export const getMessages = async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des messages' });
  }
};

export const getallmessages= async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération feed' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

