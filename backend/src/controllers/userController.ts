import { User } from '../models/user';
import { Post } from '../models/post';
import { AuthRequest } from '../middlewares/auth';
import { Response,Request } from 'express';
import mongoose, { Types } from 'mongoose';
import { Notification } from '../models/Notification';



export const getUserProfile = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
       return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 

export const getUser = async (req: Request, res: Response):Promise<void> => {
 
 
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
       return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 



export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const targetId = req.params.id;

  if (!userId || !targetId || userId === targetId) {
    res.status(400).json({ message: "ID invalide." });
    return;
  }

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) {
    res.status(404).json({ message: "Utilisateur non trouvé." });
    return;
  }

  const userIdObject = new Types.ObjectId(userId);
  const targetIdObject = new Types.ObjectId(targetId);

  // Follow
  if (!user.following.includes(targetIdObject)) {
    user.following.push(targetIdObject);
    await user.save();
  }

  if (!target.followers.includes(userIdObject)) {
    target.followers.push(userIdObject);
    await target.save();

    // Créer notification
    const notif = new Notification({
      recipient: targetIdObject,
      sender: userIdObject,
      type: 'follow',
      content: `${user.nom} vous a suivi.`,
    });
    await notif.save();
  }

  // 🤝 S'ils se suivent mutuellement → friends
  const areMutuals = target.following.includes(userIdObject);
  if (areMutuals && !user.friends.includes(targetIdObject)) {
    user.friends.push(targetIdObject);
    target.friends.push(userIdObject);
    await user.save();
    await target.save();
  }

  res.status(200).json({ message: "Utilisateur suivi avec succès." });
};


export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const targetId = req.params.id;

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) {
    res.status(404).json({ message: "Utilisateur non trouvé." });
    return;
  }

  // Retirer follow
  user.following = user.following.filter(id => id.toString() !== targetId);
  target.followers = target.followers.filter(id => id.toString() !== userId);

  // Retirer de friends si existait
  user.friends = user.friends.filter(id => id.toString() !== targetId);
  target.friends = target.friends.filter(id => id.toString() !== userId);
   

  await user.save();
  await target.save();

 // Créer notification
  
   const notif = new Notification({
      recipient: target,
      sender: user,
      type: 'unfollow',
      content: `${user.nom} vous a désabonné.`,
    });
    await notif.save();


  res.status(200).json({ message: "Désabonnement réussi." });
};


export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).populate('followers', 'nom avatar');
  if (!user) 
  {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
return;
  }
   
  res.status(200).json({ followers: user.followers });
};

export const getFollowing = async (req: Request, res: Response) : Promise<void>=> {
  const user = await User.findById(req.params.id).populate('following', 'nom avatar');
  if (!user) 
  {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
return;
  }

  res.status(200).json({ following: user.following });
};


export const isFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const targetId = req.params.id;

  if (!userId || !targetId) {
    res.status(400).json({ message: "Requête invalide" });
    return;
  }

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }

  const isFollowing = user.following.some(f => f.toString() === targetId);
  const followBack = target.following.some(f => f.toString() === userId);


  res.status(200).json({ isFollowing, followBack });
};




export const getSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.userId;
    if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
       res.status(400).json({ message: 'ID utilisateur invalide' });
       return;
    }

    const currentUser = await User.findById(currentUserId).select('following');
    if (!currentUser) {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
       return;
    }

    // Si `following` est un tableau d’objets avec champ `_id`
    const excludeIds = currentUser.following.map((user: any) => user._id.toString());
    excludeIds.push(currentUserId); // Exclure aussi soi-même

   const suggestions = await User.find({
      _id: { $nin: excludeIds },
    });


    //.select('nom username avatar');

    res.status(200).json(suggestions);
  } catch (err: any) {
    console.error("🔥 Erreur interne:", err.message, err.stack);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};


export const getFriendsUser = async (req: AuthRequest, res: Response) => {
    try {
    const currentUserId = req.user?.userId;
 const currentUser = await User.findById(currentUserId).select('friends');
    if (!currentUser) {
       res.status(404).json({ message: 'Utilisateur non trouvé' });
       return;
    }

    const fr = currentUser.friends.map((user: any) => user._id.toString());

    const frd = await User.find({
      _id: { $in: fr },
    });
      res.json(frd); 
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };