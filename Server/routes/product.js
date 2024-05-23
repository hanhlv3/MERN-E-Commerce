const router = require('express').Router()

const {insertProduct, insertCat} = require('../controllers/insertData')
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')


router.post('/insert', insertProduct)
router.post('/insertcat', insertCat)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getAllProducts)
router.put('/ratings', verifyAccessToken, ctrls.ratings)


router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImage)

router.get('/:pid', ctrls.getProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)

module.exports = router
