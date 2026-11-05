const DEFAULT_NOTIFICATIONS_LIMIT = 10;
const MAX_NOTIFICATIONS_LIMIT = 100;

function validateNotificationsQuery(req, res, next) {
  const notifId = req.params.id;
  const limit = req.query.limit;

  req.notifLimit = DEFAULT_NOTIFICATIONS_LIMIT;

  if (limit !== undefined) {
    const number = Number(limit);

    if (!Number.isInteger(number) || number < 1 || number > MAX_NOTIFICATIONS_LIMIT) {
      return res.status(400).json({ error: `"limit" doit être entre 1 et ${MAX_NOTIFICATIONS_LIMIT}` });
    }

    req.notifLimit = number;
  }

  if (notifId !== undefined) {
    const number = Number(notifId);

    if (!Number.isInteger(number) || number < 0) {
      return res.status(400).json({ error: '"notifId" doit être un nombre positif' });
    }

    req.notifId = number;
  }

  next();
}

module.exports = { validateNotificationsQuery };