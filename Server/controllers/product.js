const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const Product = require('../models/product')
const { JsonWebTokenError } = require('jsonwebtoken')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')

    if (req.body.title) req.body.slug = slugify.default(req.body.title)

    const newProduct = await Product.create(req.body)

    return res.status(200).json({
        success: newProduct ? true : false,
        productCreated: newProduct ? newProduct : 'something went wrong',
    })
})

// Filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }

    // Tach cac truong ra khoi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach((e) => delete queries[e])

    // format lai operator
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
    )
    let formatQueires = JSON.parse(queryString)

    // Filterling
    if (queries?.title)
        formatQueires.title = { $regex: queries.title, $options: 'i' }

    let queryCommand = Product.find(formatQueires)

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limitting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    // Paginaition, default page = 1 and limit = 100
    const page = +req?.query?.page * 1 || 1
    const limit = +req?.query?.limit * 1 || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit

    // skip method ==> bỏ qua mấy thằng record, những thăngf đầu tiên
    // limit ==> số record có thể lấy
    queryCommand = queryCommand.skip(skip).limit(limit)

    queryCommand.then(async (response, err) => {
        if (err) throw new Error('Somethigng went wrong')
        const counts = response.length
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'cannot get product',
            counts,
        })
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)

    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : null,
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params

    if (Object.keys(req.body).length === 0) throw new Error('Missing input')

    if (req.body.title) req.body.slug = slugify.default(req.body.title)

    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    })

    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Fail',
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params

    const deletedProduct = await Product.findByIdAndDelete(pid)

    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct
            ? deletedProduct
            : 'something went wrong',
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !comment) throw new Error('Missing input')

    // check
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    )

    if (alreadyRating) {
        // update start and comment
        await Product.updateOne(
            {
                // find
                ratings: { $elemMatch: alreadyRating },
            },
            {
                // update
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                },
            },
            {
                new: true,
            }
        )
    } else {
        // add start and comment
        const response = await Product.findByIdAndUpdate(
            pid,
            {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: _id,
                    },
                },
            },
            { new: true }
        )
    }

    // update total rating
    const updatedProduct = await Product.findById(pid)
    const totalStar = updatedProduct.ratings.reduce((sum, el) => sum + el.star, 0)
    const sumRatings = updatedProduct.ratings.length
    
    updatedProduct.totalRatings = Math.round(totalStar * 10 / sumRatings) / 10
    await updatedProduct.save()

    return res.status(200).json({
        success: true,
        updatedProduct
    })
})

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    ratings,
}
