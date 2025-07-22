import { Router } from 'express';
import { addComment, fetchCommentsByPost, getcomments, likeComment, replyToComment } from '../controllers/commentController';
import { auth } from '..//middlewares/auth';

const router = Router();

router.post('/add', auth, addComment);
router.get('/', getcomments);
router.get('/bypost/:postId',fetchCommentsByPost);
router.post('/:commentId/like', auth, likeComment);
router.post('/reply', auth, replyToComment);


export default router;
