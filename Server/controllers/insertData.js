const asyncHandler = require('express-async-handler')

const Product = require('../models/product')
const CategoryProduct = require('../models/productCategory')
const data = require('../../Data/ecommerce.json')
const { default: slugify } = require('slugify')
const categories= require('../../Data/cate_brand')

const fn = async (product) => {
    const title = product?.name + Math.round(Math.random()  * 1000000) + ''
    await Product.create({
        title: title,
        slug: slugify(title),
        description: product ?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
        category: product?.category,
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === 'Color')?.variants[0]
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('oke')
})

const fn2 = async (cate) => {
 
    await CategoryProduct.create({
        title: cate?.cate,
        brand: cate?.brand
    })
}

const insertCat = asyncHandler(async (req, res) => {
    const promises = []
    for (let cat of categories) promises.push(fn2(cat))
    await Promise.all(promises)
    return res.json('oke')
})

module.exports = {
    insertProduct,
    insertCat
}