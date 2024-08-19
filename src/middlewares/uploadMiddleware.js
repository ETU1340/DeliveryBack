// uploadConfig.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const baseUploadDir = path.join(__dirname, '..', '..', 'uploads');

// Vérifie si le dossier existe, sinon il le crée
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        let subDir = 'other'; // Répertoire par défaut
console.log(req.body.dirFileUrl);
        if (req.body.dirFileUrl) {
            subDir = req.body.dirFileUrl.toLowerCase();
        }

        const uploadDir = path.join(baseUploadDir, subDir);
        ensureDirExists(uploadDir);

        cb(null, uploadDir); // Utilise le répertoire basé sur le rôle
    },
    filename: function (req, file, cb) {
        // Conservez le nom d'origine du fichier
        cb(null, file.originalname); // Utilisez file.originalname pour conserver le nom du fichier
    }
});

// Créer une instance de multer avec la configuration
const upload = multer({ storage: storage });

module.exports = upload;
