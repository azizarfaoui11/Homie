import express from 'express';
import { getNotifications, markNotificationAsRead,markAllNotificationsAsRead, countNotifications, deleteNotif } from '../controllers/notificationsController';
import { auth } from '../middlewares/auth';

const router = express.Router();


router.get('/all', auth,getNotifications);

router.put('/:id/read', markNotificationAsRead);

router.put('/read-all', markAllNotificationsAsRead);

router.get("/count", auth, countNotifications);

router.delete('/delete/:id',deleteNotif);


export default router;
