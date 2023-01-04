const multer = require('multer');

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.floor(Math.random() * 11)}`);
    }
});

const upload = multer({ storage });

module.exports = upload.single('image');
