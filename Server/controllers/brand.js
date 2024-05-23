const asyncHandler = require('express-async-handler')

const Brand = require('../models/brand')

const createBrand = asyncHandler(async (req, res) => {
    const createdBrand = await Brand.create(req.body)

    return res.status(200).json({
        success: createdBrand ? true : false,
        createdBrand: createdBrand ? createdBrand : 'Cannot create brand',
    })
})

const getAllBrand = asyncHandler(async (req, res) => {
    const response = await Brand.find().select('title _id')
    

    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : [],
    })
})

const getBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findById(bid).select('title _id')

    return res.status(200).json({
        success: response ? true : false,
        brand: response ? response : 'cannot get',
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body)

    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Something went wrong',
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndDelete(bid)

    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Something went wrong',
    })
})

module.exports = {
    createBrand,
    getAllBrand,
    getBrand,
    updateBrand,
    deleteBrand,
}
