const asyncHandler = require('express-async-handler')

const BlogCategory = require('../models/blogCategory')



const createBlogCategory = asyncHandler(async (req, res) => {
    const createdBlogCategory = await BlogCategory.create(req.body)

    return res.status(200).json({
        success: createdBlogCategory ? true : false,
        createdBlogCategory: createdBlogCategory ? createdBlogCategory: 'Cannot create blog-category'
    })
})

const getAllBlogCategories = asyncHandler(async (req, res) => {
    const BlogCategories = await BlogCategory.find().select('title _id')

    return res.status(200).json({
        success: BlogCategories ? true : false,
        BlogCategories
    })
})

const getBlogCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdBlogCategory = await BlogCategory.findById(pcid).select('title _id')

    return res.status(200).json({
        success: createdBlogCategory ? true : false,
        createdBlogCategory
    })
})



const updateBlogCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdBlogCategory = await BlogCategory.findByIdAndUpdate(pcid,req.body)

    return res.status(200).json({
        success: createdBlogCategory ? true : false,
        createdBlogCategory
    })
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const createdBlogCategory = await BlogCategory.findByIdAndDelete(pcid)

    return res.status(200).json({
        success: createdBlogCategory ? true : false,
        createdBlogCategory
    })
})


module.exports = {
    createBlogCategory,
    getAllBlogCategories, 
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
}