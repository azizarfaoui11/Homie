import express from "express";
import multer from "multer";
import { uploadVideo, getPaginatedVideos, deleteVideo, likeVideo, unlikeVideo } from "../controllers/videoController";
import { auth } from "../middlewares/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", auth, upload.single("video"), uploadVideo);

router.get("/all", getPaginatedVideos);

router.delete("/delete/:id", auth,deleteVideo);

router.post("/:id/like", auth, likeVideo);
router.post("/:id/unlike", auth, unlikeVideo);


export default router;
