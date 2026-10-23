function validateThemeId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.themeId = id;
  next();
}

function validateThemeSlug(req, res, next) {
  const slug = req.params.slug?.trim().toLowerCase();
  if (!slug || slug.length > 50) {
    return res.status(400).json({ error: '"slug" est requis (50 caractères maximum)' });
  }
  req.themeSlug = slug;
  next();
}

module.exports = { validateThemeId, validateThemeSlug };
