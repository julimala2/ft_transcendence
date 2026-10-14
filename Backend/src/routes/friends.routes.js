const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friends.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const { validateFriendshipId } = require('../middlewares/friends.middleware.js');

router.use(verifyToken);

router.post('/', friendController.sendRequest);
router.patch('/:friendshipId/accept', validateFriendshipId, friendController.acceptRequest);
router.patch('/:friendshipId/decline', validateFriendshipId, friendController.declineRequest);
router.delete('/:friendshipId', validateFriendshipId, friendController.removeFriendship);
router.get('/', friendController.findFriends);
router.get('/requests/received', friendController.getReceivedRequests);
router.get('/requests/sent', friendController.getSentRequests);

module.exports = router;