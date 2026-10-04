import multer from 'multer'

const storage = multer.memoryStorage()

//Filter files --> Allow only image type files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
        return;
    }
        cb(new Error("File is not an Image"), false)
}

//Processing of files
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload