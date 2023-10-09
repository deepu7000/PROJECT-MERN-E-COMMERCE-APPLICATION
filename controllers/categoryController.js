import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req,res) => {
    try {
        const {name} = req.body
        if(!name) {
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory) {
            return res.status(200).send({
                success:true,
                message:'category already exisits'
            })
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'new category created',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error in category',
            error
        })
    }
};

export const updateCategoryController = async (req,res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:'Category Update Successfully',
            category,
        })    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while updating category'
        })
    }
};

export const categoryController = async (req,res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:'All categories List',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while getting all categories',
            error
        })
    }
};

export const singleCategoryController = async (req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:'successfully get the single category',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:true,
            message:'fail to get the single category',
            error
        })
    }
};

//delete category
export  const deleteCategoryController = async (req,res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'Successfully Deleted the Category',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"something went wrong, can't delete category"
        })
    }
};