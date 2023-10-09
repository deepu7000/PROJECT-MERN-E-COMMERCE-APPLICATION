import express from "express";
import {registerController,loginController, testController,forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController} from "../controllers/authControllers.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";



const router = express.Router();
//Register route
router.post('/register', registerController)

//Login route
router.post('/login' , loginController)

router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test',requireSignIn, isAdmin, testController)


//User protected routes
router.get('/user-auth', requireSignIn , (req,res) => {
    res.status(200).send({ok:true})
})

//Admin protected routes
router.get('/Admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get('/orders', requireSignIn, getOrderController)


//All orders
router.get('/all-orders', requireSignIn, isAdmin,  getAllOrderController)

//order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)

export default router;
