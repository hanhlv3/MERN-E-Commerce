const router = require('express').Router()

const ctrls = require('../controllers/coupon')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createCoupon)

router.get('/',ctrls.getAllCoupon)
router.get('/:bid',ctrls.getCoupon)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)

module.exports = router


