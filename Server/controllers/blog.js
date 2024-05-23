const asyncHandler = require('express-async-handler')

const Blog = require('../models/blog')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body

    if (!title || !description || !category) throw new Error('Missing inputs')

    const response = await Blog.create(req.body)

    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog',
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()

    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get  blogs',
    })
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Blog.findByIdAndUpdate(
        bid,
        { $inc: { numberViews: 1 } },
        { new: true }
    )
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname')

    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get  blog',
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params

    if (!bid) throw new Error('Missing inputs')

    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })

    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update blog',
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params

    if (!bid) throw new Error('Missing inputs')

    const response = await Blog.findByIdAndDelete(bid)

    return res.status(200).json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot deleted blog',
    })
})


// like, dislike logic
/*
1. 
*/

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params

    if (!bid) throw new Error('Missing input')

    const alreadyBlog = await Blog.findById(bid)
    const isDisliked = alreadyBlog?.dislikes?.find(
        (el) => el.toString() === _id
    )

    // liked ==> pull
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    }

    const isLiked = alreadyBlog?.likes?.find((el) => el.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { likes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    }
})

const disLikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params

    if (!bid) throw new Error('Missing input')

    const alreadyBlog = await Blog.findById(bid)
    const isLiked = alreadyBlog?.likes?.find((el) => el.toString() === _id)

    // liked ==> pull
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    }

    const isDisLiked = alreadyBlog?.dislikes?.find(
        (el) => el.toString() === _id
    )
    if (isDisLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { dislikes: _id } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            blog: response ? response : 'cannot like',
        })
    }
})

const uploadImage = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if (!req.file) throw new Error('Missing input')
    const response = await Blog.findByIdAndUpdate(
        bid,
        {  image: req.file.path },
        { new: true }
    )

    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'something went wrong',
    })
})


module.exports = {
    createNewBlog,
    getBlogs,
    getBlog,
    updateBlog,
    likeBlog,
    disLikeBlog,
    deleteBlog,
    uploadImage,
}
