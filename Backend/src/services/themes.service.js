const themesModel = require('../models/themes.model');

async function getThemes() {
    return themesModel.findAllThemes();
}

async function getThemesByName(name) {
    return themesModel.findByName(name);
}

async function getThemesById(id) {
    return themesModel.findById(id);
}

async function getThemesBySlug(slug) {
    return themesModel.findBySlug(slug);
}

module.exports = {
    getThemes,
    getThemesByName,
    getThemesById,
    getThemesBySlug
};