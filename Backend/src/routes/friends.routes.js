const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friends.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const { validateFriendshipId } = require('../middlewares/friends.middleware.js');

router.post('/', verifyToken, friendController.sendRequest);
router.patch('/:friendshipId/accept', verifyToken, validateFriendshipId, friendController.acceptRequest);
router.patch('/:friendshipId/decline', verifyToken, validateFriendshipId, friendController.declineRequest);
router.delete('/:friendshipId', verifyToken, validateFriendshipId, friendController.removeFriendship);
router.get('/', verifyToken, friendController.findFriends);
router.get('/requests/received', verifyToken, friendController.getReceivedRequests);
router.get('/requests/sent', verifyToken, friendController.getSentRequests);

module.exports = router;