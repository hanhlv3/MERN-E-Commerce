const asyncHandler = require('express-async-handler')

const ProductCategory = require('../models/productCategory')



const createProductCategory = asyncHandler(async (req, res) => {
    const createdProductCategory = await ProductCategory.create(req.body)

    return res.status(200).json({
        success: createdProductCategory ? true : false,
        createdProductCategory: createdProductCategory ? createdProductCategory: 'Cannot create-category'
    })
})

const getAllProductCategories = asyncHandler(async (req, res) => {
    const productCategories = await ProductCategory.find().select('title _id')

    return res.status(200).json({
        success: productCategories ? true : false,
        productCategories
    })
})

const getProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdProductCategory = await ProductCategory.findById(pcid).select('title _id')

    return res.status(200).json({
        success: createdProductCategory ? true : false,
        createdProductCategory
    })
})



const updateProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdProductCategory = await ProductCategory.findByIdAndUpdate(pcid,req.body)

    return res.status(200).json({
        success: createdProductCategory ? true : false,
        createdProductCategory
    })
})

const deleteProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdProductCategory = await ProductCategory.findByIdAndDelete(pcid)

    return res.status(200).json({
        success: createdProductCategory ? true : false,
        createdProductCategory
    })
})


module.exports = {
    createProductCategory,
    getAllProductCategories, 
    getProductCategory,
    updateProductCategory,
    deleteProductCategory,
}