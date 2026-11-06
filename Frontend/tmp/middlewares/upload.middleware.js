const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/avatars';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `user${req.user.id}-${Date.now()}${ext}`);
    },
});

function fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Format de fichier non supporte (jpg, png uniquement)'));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});

function handleUploadError(err, req, res, next) {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Fichier trop volumineux (2 Mo max)' });
        }
        return res.status(400).json({ error: err.message });
    }
    next();
}

module.exports = { uploadAvatar: upload.single('avatar'), handleUploadError };