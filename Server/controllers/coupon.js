const asyncHandler = require('express-async-handler')

const Coupon = require('../models/coupon')

const createCoupon = asyncHandler(async (req, res) => {
    const { expiry } = req.body
    if (expiry) req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000

    const createdCoupon = await Coupon.create(req.body)

    return res.status(200).json({
        success: createdCoupon ? true : false,
        createdCoupon: createdCoupon ? createdCoupon : 'Cannot create Coupon',
    })
})

const getAllCoupon = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt')

    return res.status(200).json({
        success: response ? true : false,
        Coupons: response ? response : [],
    })
})

const getCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const response = await Coupon.findById(cid).select('-createdAt -updatedAt')

    return res.status(200).json({
        success: response ? true : false,
        Coupon: response ? response : 'cannot get',
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const { expiry } = req.body
    if (expiry) req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000

    const response = await Coupon.findByIdAndUpdate(cid, req.body)

    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Something went wrong',
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const response = await Coupon.findByIdAndDelete(cid)

    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Something went wrong',
    })
})

module.exports = {
    createCoupon,
    getAllCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
}
