const notifService = require('../services/notifications.service');
const { sendServiceError } = require('../../lib/errorHandling');


async function getNotifications(req, res) {
    try {
        const notifs = await notifService.getNotifications(req.user.id, req.notifLimit);
        return res.status(200).json(notifs);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function readOneNotification(req, res) {
    try {
        await notifService.readOneNotification(req.user.id, req.notifId);
        return res.status(200).json({ message: "Notification lue" });
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function readAllNotifications(req, res) {
    try {
        await notifService.readAllNotifications(req.user.id);
        return res.status(200).json({ message: "Notifications lues" });
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function deleteOneNotification(req, res) {
    try {
        await notifService.deleteOneNotification(req.user.id, req.notifId);
        return res.status(200).json({ message: "Notification supprimée" });
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function deleteAllNotifications(req, res) {
    try {
        await notifService.deleteAllNotifications(req.user.id);
        return res.status(200).json({ message: "Notifications supprimées" });
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

module.exports = {
    getNotifications, 
    readOneNotification,
    readAllNotifications,
    deleteOneNotification,
    deleteAllNotifications
};