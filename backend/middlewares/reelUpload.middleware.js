import multer from 'multer'

const storage = multer.memoryStorage()

//Filter files --> Allow only image type files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true)
    }
    else {
        cb(new Error("File is not an Image"), false)
    }
}

//Processing of files
const reelUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

export default reelUpload