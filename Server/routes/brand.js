const router = require('express').Router()

const ctrls = require('../controllers/brand')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')




router.post('/', [verifyAccessToken, isAdmin], ctrls.createBrand)

router.get('/',ctrls.getAllBrand)
router.get('/:bid',ctrls.getBrand)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)

module.exports = router


