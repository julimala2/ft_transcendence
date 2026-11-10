const themesServices = require('../services/themes.service');

async function getAllThemes(req, res) {
    try {
        const themes = await themesServices.getThemes();
        return res.status(200).json(themes);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getThemesById(req, res) {
    try {
        const theme = await themesServices.getThemesById(req.themeId);
        if (!theme) {
            return res.status(404).json({ error: 'Thème introuvable' });
        }
        return res.status(200).json(theme);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getThemesBySlug(req, res) {
    try {
        const theme = await themesServices.getThemesBySlug(req.themeSlug);
        if (!theme) {
            return res.status(404).json({ error: 'Thème introuvable' });
        }
        return res.status(200).json(theme);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}


module.exports = {
    getAllThemes,
    getThemesById,
    getThemesBySlug
};