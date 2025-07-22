import { Router, RequestHandler } from 'express';
import { createUser, deleteUser, getAllUsers, getUsersByRoleParam, login, logout, register, updateUser } from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { upload } from '../middlewares/uploads';

const router = Router();

router.get('/getusers',getAllUsers);
router.post('/register',   upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/logout', auth, logout);
router.put(
  '/updateuser/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),
  updateUser
);router.delete('/deleteuser/:id', deleteUser);
router.post('/createuser', createUser);
router.get('/userbyrole/:role',getUsersByRoleParam);


export default router; 