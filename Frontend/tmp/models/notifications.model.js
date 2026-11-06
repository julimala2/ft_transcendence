const prisma = require('../../lib/prisma');

async function getMyNotifications(userId, limit) {
    return prisma.notification.findMany({
        where: { user_id : userId },
        orderBy: { created_at: 'desc' },
        take: limit
    });
}

async function markAsReadById(userId, notifId) {
    return prisma.notification.update({
        where: { 
            user_id : userId,
            id : notifId },
        data: { is_read : true },
    });
}

async function markAllAsRead(userId) {
    return prisma.notification.updateMany({
        where: { 
            user_id : userId,
            is_read: false },
        data: { is_read : true },
    });
}

async function deleteNotificationById(userId, notifId) {
    return prisma.notification.delete({
        where: { 
            user_id : userId,
            id : notifId },
    });
}

async function deleteAllNotifications(userId) {
    return prisma.notification.deleteMany({
        where: { user_id : userId }
    });
}

async function createNotification(userId, type, message) {
    return prisma.notification.create({
        data: {
            user_id: userId,
            type,
            message
        }
    });
}

module.exports = { 
    get10Notifications,
    getAllNotifications,
    markAsReadById,
    markAllAsRead,
    deleteNotificationById, 
    deleteAllNotifications
}