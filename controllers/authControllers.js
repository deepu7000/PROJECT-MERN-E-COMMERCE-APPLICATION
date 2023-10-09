import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authHelper.js";
import JWT from "jsonwebtoken";


export const registerController = async (req,res) => {
    try     {
        const {name,email,password,answerForgot,phone,address,role} = req.body
        //validation process
        if(!name){
            return res.send({message:'Name is missing'});
        }

        if(!password){
            return res.send({message:'Password is missing'});
        }

        if(!phone){
            return res.send({message:'Phone Number is missing'});
        }

        if(!address){
            return res.send({message:'Address is missing'});
        }
        if(!email){
            return res.send({message:'Email is missing'});
        }
        if(!answerForgot){
            return res.send({message:'Address is missing'});
        }
        if(!role){
            return res.send({message:'Mension you are admin or normal user'});
        }

        //checking user is available
        const currentUser = await userModel.findOne({email});

        //user available
        if(currentUser){
            return res.status(200).send({
                success:false,
                message:'Already regestered please login'
            })
        }

        //new regestration 
        const hashedPassword = await hashPassword(password);

        //save new user
        const user = await new userModel({name,email,phone,address,answerForgot,role,password:hashedPassword}).save();

       if(user) {
            res.status(201).send({
                success:true,
                message:'user regestred successfully',
                user
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error in regestration',
            error
        })
    }
};

export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;

        //user validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalied email or password'
            })
        }

        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
        const match = await comparePassword(password,user.password)

        //check password
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalied password',
            })
        }

        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})

        res.status(200).send({
            success:true,
            message:"login successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,

            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
};

//test middleware
export const testController = (req,res) => {
    res.send('Route Protection Enabled');
};

export const forgotPasswordController = async (req,res) => {
    try {
        const {email,newpassword,answerForgot} = req.body;
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answerForgot){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newpassword){
            res.status(400).send({message:'New Password is reqired'})
        }

        const user = await userModel.findOne({email,answerForgot});
        
        //finding forgoter user
        if(!user) {
            return res.status(404).send({
                success:false,
                message:'Invalied email or Invalied answer'
            });
        }

        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashed})
        res.status(200).send({
            success:true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong forgotpassword controller',
            error
        })
    }
}

//update profile detials
export const updateProfileController = async (req,res) => {
    try {
        const {name,password,email,address,phone} = req.body
        const user = await userModel.findById(req.user._id)

        //password
        if(!password && password.length < 6){
            return res.json({error:'Password is required and 6 character long'})            
        }
        const hashedPassword = password? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password : hashedPassword || user.password,
            phone : phone || user.phone,
            address : address || user.address
        },{new:true})
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error While Update Profile',
            error,
        })
    }
};

//orders
export const getOrderController = async (req,res) => {
    try {
        const orders = await orderModel
            .find({buyer: req.user._id})
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting orders',
            error,
        })
    }
}

//All orders
export const getAllOrderController = async (req,res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({createdAt: "-1"})
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting orders',
            error,
        })
    }
}

//order status
export const orderStatusController = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId, 
            {status}, 
            {new:true}
            );
            res.json(orders);
    } catch (error) {
       console.log(error)
       res.status(500).send({
        success:false,
        message:'Error while updating orders',
        error
       }) 
    }
}

