const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const notifController = require('../controllers/notifications.controller');
const { validateNotificationsQuery } = require('../middlewares/notifications.middleware');

router.use(verifyToken);

router.get('/', validateNotificationsQuery, notifController.getNotifications);
router.patch('/read-all', notifController.readAllNotifications);
router.patch('/:id/read', validateNotificationsQuery, notifController.readOneNotification);
router.delete('/delete-all', notifController.deleteAllNotifications);
router.delete('/:id', validateNotificationsQuery, notifController.deleteOneNotification);

module.exports = router;
