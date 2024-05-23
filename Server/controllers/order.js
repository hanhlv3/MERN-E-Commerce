const asyncHandler = require('express-async-handler')

const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon } = req.body
    const userCart = await User.findById(_id)
        .select('cart')
        .populate('cart.product', 'title price')
    const products = userCart?.cart?.map((el) => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color,
    }))

    let total = userCart?.cart?.reduce(
        (sum, el) => el.product.price * el.quantity + sum,
        0
    )
    const createData = { products, total, orderBy: _id }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon).select('discount')
        total =
            Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
                1000 || total
        createData.total = total
        createCoupon = coupon
    }

    const createdOrder = await Order.create({ products, total, orderBy: _id })

    return res.status(200).json({
        success: createdOrder ? true : false,
        createdOrder: createdOrder ? createdOrder : 'Cannot create Order',
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body.status

    if (!status) throw new Error('Missing input')

    const response = await Order.findByIdAndUpdate(
        oid,
        { status },
        { new: true }
    )

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot update status Order',
    })
})

const getAllOrder = asyncHandler(async (req, res) => {
    const response = await Order.find()

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'something went wrong',
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'cannot get',
    })
})


const deleteOrder = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Order.findByIdAndDelete(bid)

    return res.status(200).json({
        success: response ? true : false,
        deletedOrder: response ? response : 'Something went wrong',
    })
})

module.exports = {
    createOrder,
    getAllOrder,
    getUserOrder,
    updateStatus,
    deleteOrder,
}
