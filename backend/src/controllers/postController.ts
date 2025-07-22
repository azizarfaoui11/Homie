import { Request, Response } from 'express';
import { Post } from '../models/post';
import { AuthRequest } from '../middlewares/auth';
import { Types } from 'mongoose';
import { User } from '../models/user';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
     const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
    const image = req.file?.filename; // ou path complet si besoin


    const post = new Post({
      content: req.body.content,
      author: userId,
      image:image,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création post' });
  }
};



export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nom avatar') 
      .populate('sharedFrom', 'content image')
      .populate({
        path: 'sharedFrom',
        populate: { path: 'author', select: 'nom avatar' }, // populate nested author
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération feed' });
  }
};


export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const poste = await Post.findById(req.params.id);
    if (!poste) 
     res.status(404).json({ message: "Poste not found" });
    res.status(200).json(poste);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deletepost = async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getPostByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const post = await Post.find({ author: userId })
      .populate('author', 'nom avatar') 
      .populate('sharedFrom', 'content image')
      .populate({
        path: 'sharedFrom',
        populate: { path: 'author', select: 'nom avatar' }, 
      })
      .sort({ createdAt: -1 });
      
        
  
      res.status(200).json(post);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des postes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };


export const toggleLike = async (req: AuthRequest, res: Response) :Promise<void> =>{
  const userId = req.user?.userId;


  if (!userId) {
     res.status(401).json({ message: 'Authentification requise' });
  }

  const objectUserId = new Types.ObjectId(userId); 
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) 
    {
       res.status(404).json({ message: 'Post non trouvé' });
      return;
}

    const hasLiked = post.likes.includes(objectUserId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(objectUserId);
    }

    await post.save();

    res.json({ liked: !hasLiked, likeCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Erreur toggle like' });
  }
};

// POST /api/posts/share/:postId
export const sharePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const originalPost = await Post.findById(postId);
    if (!originalPost) 
       res.status(404).json({ message: "Post original introuvable" });

    const newPost = new Post({
      content,
      author: req.user?.userId,
      sharedFrom: originalPost?._id,
    });

    await newPost.save();

    res.status(201).json({ message: "Post partagé avec succès", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du partage", error });
  }
};


export const getImagesByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    // Récupérer les images des posts
    const posts = await Post.find({ author: userId }); // ou { userId } selon ton modèle

    const postImages = posts.flatMap(post => post.image || []);

    // Ajouter avatar et coverPhoto si existants
    const userImages = [];
    if (user.avatar) userImages.push(user.avatar);
    if (user.coverPhoto) userImages.push(user.coverPhoto);

    const allImages = [...userImages, ...postImages];

    res.json({ images: allImages });
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
