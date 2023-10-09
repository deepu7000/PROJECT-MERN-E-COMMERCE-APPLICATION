import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productContoller.js'
import formidable from "express-formidable"

const router = express.Router()

//routes
router.post('/create-product', requireSignIn, isAdmin,formidable(), createProductController)

//get product
router.get('/get-product', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin,formidable(), updateProductController)

//delete product
router.delete('/product-delete/:pid', deleteProductController)

//filter product
router.post('/product-filters', productFilterController);

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get("/search/:keyword", searchProductController)

//Relative Product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

//braintree token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router
           