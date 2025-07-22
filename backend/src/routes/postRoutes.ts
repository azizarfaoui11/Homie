import { Router } from 'express';
import { createPost, deletepost, getImagesByUser, getPostById, getPostByUser, getPosts, sharePost, toggleLike } from '../controllers/postController';
import { auth } from '../middlewares/auth';
import { upload } from '../middlewares/uploads';

const router = Router();

router.post('/add', auth,upload.single('image'), createPost);
router.get("/mine",auth,getPostByUser);
router.get('/', getPosts);
router.get("/:id", getPostById);
router.delete("/delete/:id", deletepost);
router.patch("/:postId/like",auth,toggleLike);
router.post('/share/:postId', auth, sharePost);
router.get('/user/images', auth, getImagesByUser);


//router.post('/:id/like', authenticate, likePost);

export default router;
