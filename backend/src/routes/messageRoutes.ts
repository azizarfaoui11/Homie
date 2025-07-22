import { Router } from 'express';
import { sendMessage, getMessages, getallmessages, deleteMessage } from '../controllers/messageController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/',auth, sendMessage);
router.get('/:userId1/:userId2', getMessages);
router.get('/',getallmessages);
router.delete('/deletemess/:id',deleteMessage);


export default router;
