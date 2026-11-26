import multer from 'multer';

export const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter(req, file, cb) {
        const allowedTypes = [
            'image/jpeg',
            'image/png'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('Only JPG and PNG images are allowed');
            error.statusCode = 400;
            cb(error);
        }
    }
});