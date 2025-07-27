import { Request, Response } from 'express';
import { Comment } from '../models/commentaire';
import { AuthRequest } from '../middlewares/auth';
import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { Post } from '../models/post';
import { Video } from '../models/Video';


export const addComment = async (req: AuthRequest, res: Response) : Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const postId = req.body.postId;
    const post = await Post.findById(postId).select('author');
    if (!post) {
       res.status(404).json({ message: "Post introuvable" });
       return;
    }

    // Ajouter le commentaire
    const comment = new Comment({
      post: postId,
      content: req.body.content,
      author: userId
    });
    await comment.save();

    // Créer la notification
    const notif = new Notification({
      recipient: post.author, // on récupère l’auteur du post depuis la BDD
      sender: new Types.ObjectId(userId),
      type: 'comment',
    });
    await notif.save();

    res.status(200).json({ message: "Commentaire ajouté avec succès." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire' });
  }
};



export const getcomments= async (_req: Request, res: Response) => {
  try {
    const posts = await Comment.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération des commentaires' });
  }
};

export const fetchCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId, parentCommentId: null }) // ne filtre plus sur `replies`
      .populate('author', 'nom') // on veut le nom de l’auteur du commentaire principal
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'nom' }, // pour les auteurs des réponses
      })
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    const userId = req.user?.userId;
   const userobject= new Types.ObjectId(userId);
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId) ;
    if (!comment) 
    {  res.status(404).json({ message: "Commentaire introuvable" });
       return;}
      
     

    const alreadyLiked = comment.likes.includes(userobject);
    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userobject);
    }

    await comment.save();
    res.status(200).json({ liked: !alreadyLiked, likeCount: comment.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du like' });
  }
};



export const replyToComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { parentCommentId, content, postId } = req.body;

    const reply = new Comment({
      post: postId,
      content,
      author: userId,
      parentCommentId,
    });

    await reply.save();

    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: reply._id },
    });

    const populatedReply = await Comment.findById(reply._id).populate('author');

    res.status(201).json(populatedReply); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la réponse au commentaire' });
  }
};

export const createCommentforvideo = async (req: AuthRequest, res: Response) : Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const videoId = req.body.videoId;
    const vid = await Video.findById(videoId);
    if (!vid) {
       res.status(404).json({ message: "Video introuvable" });
       return;
    }

     // const  video= new Types.ObjectId(vid);
    // Ajouter le commentaire
    const comment = new Comment({
      video: vid,
      content: req.body.content,
      author: userId
    });
    await comment.save();

    

    res.status(200).json({ message: "Commentaire ajouté avec succès." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire' });
  }
};


export const getCommentsByVideo = async (req: Request, res: Response) => {
  try {

      const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("author", "nom avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
};


