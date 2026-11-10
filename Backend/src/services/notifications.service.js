const notifModel = require('../models/notifications.model');
const { serviceError } = require('../../lib/errorHandling');

async function getNotifications(userId, limit) {
    return notifModel.getMyNotifications(userId, limit);
}

async function readOneNotification(userId, notifId) {
    try {
        return await notifModel.markAsReadById(userId, notifId);
    }
    catch (err) {
        if (err.code === 'P2025') {
            throw serviceError('NOTIFICATION_NOT_FOUND');
        }
        throw err;
    }
}

async function readAllNotifications(userId) {
    return notifModel.markAllAsRead(userId);
}

async function deleteOneNotification(userId, notifId) {
    try {
        return await notifModel.deleteNotificationById(userId, notifId);
    }
    catch (err) {
        if (err.code === 'P2025') {
            throw serviceError('NOTIFICATION_NOT_FOUND');
        }
        throw err;
    }
}

async function deleteAllNotifications(userId) {
    return await notifModel.deleteAllNotifications(userId);
}

async function notifyUser(userId, type, message) {
    try {
        await notifModel.createNotification(userId, type, message);
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = {
    getNotifications,
    readOneNotification,
    readAllNotifications,
    deleteOneNotification,
    deleteAllNotifications, 
    notifyUser
};