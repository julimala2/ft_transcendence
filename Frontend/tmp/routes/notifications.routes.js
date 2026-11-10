const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
//const notifController = require('../controllers/notifications.controller');

router.use(verifyToken);

// router.get('/', notifController.);
// router.patch('/read-all', notifController.);
// router.post('/:id/read', notifController.);
// router.delete('/:id', notifController.);

module.exports = router;
