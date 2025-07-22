import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { followUser, getFollowers, getFollowing, getSuggestions, getUser, getUserProfile, isFollowing, unfollowUser } from '../controllers/userController';

const router = Router();

router.get('/profile',auth, getUserProfile);
router.get('/suggestions', auth, getSuggestions);

router.get('/:id',getUser);
router.post('/follow/:id', auth, followUser);
router.post('/unfollow/:id', auth, unfollowUser);
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);
router.get('/isFollowing/:id', auth, isFollowing);



export default router;






