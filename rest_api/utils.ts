const fileFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|pdf|json)$/)) {
        return cb(new Error('file type not allowed!'), false);
    }
    cb(null, true);
};

export { fileFilter }
