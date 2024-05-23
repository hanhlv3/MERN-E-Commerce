const router = require('express').Router()

const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)

router.put(
    '/uploadimage/:bid',
    [verifyAccessToken, isAdmin],
    uploader.single('image'),
    ctrls.uploadImage
)

router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.disLikeBlog)

router.get('/', ctrls.getBlogs)
router.get('/:bid', ctrls.getBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router
