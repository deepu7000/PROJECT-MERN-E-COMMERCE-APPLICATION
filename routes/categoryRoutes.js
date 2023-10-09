import express from 'express'
import {isAdmin, requireSignIn} from './../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router()

//category route
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//update category route
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//All category route
router.get('/get-category', categoryController)

//Single category route
router.get('/get-one-category/:slug', singleCategoryController)

//Delete category route
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)


export default router   