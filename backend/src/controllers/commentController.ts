import { Request, Response } from 'express';
import { Comment } from '../models/commentaire';
import { AuthRequest } from '../middlewares/auth';
import { Types } from 'mongoose';

export const addComment = async (req: AuthRequest, res: Response) => {
  try {

      const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
    const comment = new Comment({
      post: req.body.postId,
      content: req.body.content,
      author: userId
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout commentaire' });
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
    const comments = await Comment.find({ post: postId, replies: { $exists: true } })
      .populate('author')
      .populate({
        path: 'replies',
        populate: { path: 'author content' }
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
    const { parentCommentId, content,postId } = req.body;

    const reply = new Comment({
      post: postId,
      content,
      author: userId,
      parentCommentId:parentCommentId,
    });

    await reply.save();

    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: reply._id },
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la réponse au commentaire' });
  }
};

