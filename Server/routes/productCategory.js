const router = require('express').Router()

const ctrls = require('../controllers/productCategory')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProductCategory)
router.get('/', ctrls.getAllProductCategories)


router.get('/:pcid', ctrls.getProductCategory)
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateProductCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteProductCategory)


module.exports = router