import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'nom avatar');

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notifications." });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
     res.status(400).json({ message: 'ID de notification invalide.' });
     return;
  }

  try {
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Notification marquée comme lue.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
};

export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
};

export const countNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const count = await Notification.countDocuments( {recipient: userId});
  res.status(200).json({ count });
};

export const deleteNotif = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Vérifier si l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
      }
  
      const Notif = await Notification.findById(id);
  
      if (!Notif) {
        res.status(404).json({ message: 'notification non trouvé' });
        return;
      }
  
      await Notif.deleteOne();
      
      res.json({ message: 'Notification supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
