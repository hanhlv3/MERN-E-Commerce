const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/register',  ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refresh-token', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.post('/reset-password', ctrls.resetPassword)
router.get('/get-all-users', [verifyAccessToken, isAdmin], ctrls.getAllUsers)
router.post('/update-user', verifyAccessToken, ctrls.updateUser)
router.post('/update-user/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.put('/address-user/:uid', [verifyAccessToken], ctrls.updateUserAddress)
router.put('/cart-user', [verifyAccessToken], ctrls.updateCart)

router.delete('/delete-user/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser)

module.exports = router