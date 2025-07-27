import { Request, Response } from "express";
import AWS from "aws-sdk";
import {Video} from "../models/Video";
import { AuthRequest } from "../middlewares/auth"; // si tu as un middleware auth typé

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

export const uploadVideo = async (req: AuthRequest, res: Response) : Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
       res.status(400).json({ error: "Aucun fichier vidéo fourni." });
       return;
    }

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `reels/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      acl: 'public-read'


    };

    const data = await s3.upload(uploadParams).promise();

    const video = await Video.create({
      userId: req.user?.userId,
      title: req.body.title,
      description: req.body.description,
      videoUrl: data.Location,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error("Erreur upload vidéo :", err);
    res.status(500).json({ error: "Erreur lors de l'upload de la vidéo." });
  }
};

export const getPaginatedVideos = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "nom avatar");

    res.json(videos);
  } catch (err) {
    console.error("Erreur pagination vidéos:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des vidéos" });
  }
};


export const deleteVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).json({ message: "Vidéo non trouvée." });
      return;
    }

    // Vérifie que l'utilisateur connecté est bien le propriétaire
    if (video.userId.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Accès non autorisé." });
      return;
    }

    // Extraction de la clé S3 à partir de l'URL
    const videoKey = video.videoUrl.split(`${process.env.AWS_S3_BUCKET}/`)[1];

    if (videoKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: videoKey,
        })
        .promise();
    }

    await video.deleteOne();

    res.json({ message: "Vidéo supprimée avec succès." });
  } catch (err) {
    console.error("Erreur suppression vidéo:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de la vidéo." });
  }
};

export const likeVideo = async (req : AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const videoId = req.params.id;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
    });
    res.status(200).json({ message: "Liked" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const unlikeVideo = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const videoId = req.params.id;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $pull: { likes: userId },
    });
    res.status(200).json({ message: "Unliked" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};




