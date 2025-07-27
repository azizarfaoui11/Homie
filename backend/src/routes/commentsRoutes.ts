import { Router } from 'express';
import { addComment, createCommentforvideo, fetchCommentsByPost, getcomments, getCommentsByVideo, likeComment, replyToComment } from '../controllers/commentController';
import { auth } from '..//middlewares/auth';

const router = Router();

router.post('/add', auth, addComment);
router.get('/', getcomments);
router.get('/bypost/:postId',fetchCommentsByPost);
router.post('/:commentId/like', auth, likeComment);
router.post('/reply', auth, replyToComment);
router.post("/video", auth, createCommentforvideo);
router.get("/video/:videoId", getCommentsByVideo);


export default router;
