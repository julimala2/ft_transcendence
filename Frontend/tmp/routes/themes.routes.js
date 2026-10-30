const express = require('express');
const router = express.Router();
const themesController = require('../controllers/themes.controller');
const { validateThemeSlug, validateThemeId } = require('../middlewares/themes.middleware');


router.get('/', themesController.getAllThemes);
router.get('/slug/:slug', validateThemeSlug, themesController.getThemesBySlug);
router.get('/:id', validateThemeId, themesController.getThemesById);

module.exports = router;