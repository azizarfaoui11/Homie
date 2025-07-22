import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventByUser,
  joinEvent,
  leaveEvent,
  updateEvent,
} from '../controllers/eventController';
import { auth } from '../middlewares/auth';
import { upload } from '../middlewares/uploads';

const router = Router();

router.post('/add', auth,upload.single('image'), createEvent);
router.get("/mine",auth,getEventByUser);
router.get('/:id', getEventById);
router.get('/', getAllEvents);
router.post('/:id/join', auth, joinEvent);
router.post('/:id/leave', auth, leaveEvent);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);


export default router;
