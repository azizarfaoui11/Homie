import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { AuthRequest } from '../middlewares/auth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';


dotenv.config(); 



const JWT_SECRET = process.env.JWT_SECRET || '' ;

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nom,role, telephone,etat,birthdate,gender,location,bio,occupation,hobbies } = req.body;

    // Vérifier les rôles autorisés
    if (![ 'User','Admin' ].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const avatar = files?.['avatar']?.[0]?.filename;
    const coverPhoto = files?.['coverPhoto']?.[0]?.filename;

    // Créer un nouvel utilisateur
    const user = new User({
      nom,
      email,
      password,
      role,
      telephone,
      etat,
      birthdate,
      gender,
     avatar:avatar,
     coverPhoto:coverPhoto,
     location,
     bio,
     occupation,
     hobbies, 
    });

    await user.save();

    // Générer le token JWT avec rôle
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        telephone:user.telephone,
        etat : user.etat,

      }
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    
  }
    
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

 let shouldSave = false;

if (user.etat !== 'actif') {
  user.etat = 'actif';
  shouldSave = true;
}

if (user.isOnline !== true) {
  user.isOnline = true;
  shouldSave = true;
}

if (shouldSave) {
  await user.save(); // Une seule sauvegarde si nécessaire
}

    



    // Générer le token JWT avec rôle
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await User.findByIdAndUpdate(userId, { etat: 'inactif' });
    await User.findByIdAndUpdate(userId, { isOnline: false });

    res.status(200).json({ message: 'Déconnecté avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur de déconnexion' });
  }
};



export const getAllUsers = async (req: Request, res: Response) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const users = await User.find().select('-password'); // Exclure le mot de passe
      res.json(users); // Retourner la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const getUsersByRoleParam = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const users = await User.find({ role }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



  
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Vérifier si l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
      }
  
      const user = await User.findById(id);
  
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
  
      await user.deleteOne();
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, email, password, role , telephone } = req.body;

    if (!nom || !email || !password || !role) {
      res.status(400).json({ message: 'Champs requis manquants' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email déjà utilisé' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nom,
      email,
      password: hashedPassword,
      role,
      telephone,
      etat:'inactif'
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};  




  export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, telephone, bio, location, birthdate, gender,occupation,hobbies } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
const avatar = files['avatar']?.[0];
const coverPhoto = files['coverPhoto']?.[0];

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    if (nom) user.nom = nom;
    if (telephone) user.telephone = telephone;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (birthdate) user.birthdate = birthdate;
    if (gender) user.gender = gender;
    if (avatar) user.avatar = avatar.filename;
    if (coverPhoto) user.coverPhoto = coverPhoto.filename;
    if (occupation) user.occupation = occupation;
    if (hobbies) user.hobbies = hobbies;


    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


/*export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, telephone, bio, location, birthdate, gender } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
const avatar = files['avatar']?.[0];
const coverPhoto = files['coverPhoto']?.[0];

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    if (nom) user.nom = nom;
    if (telephone) user.telephone = telephone;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (birthdate) user.birthdate = birthdate;
    if (gender) user.gender = gender;
    if (avatar) user.avatar = avatar.filename;
    if (coverPhoto) user.coverPhoto = coverPhoto.filename;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};*/