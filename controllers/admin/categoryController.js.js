
const Category=require('../../models/catogerySchema');
const Product = require('../../models/productsSchema');

const mongoose=require('mongoose')
const bcrypt = require('bcrypt');
const Admin = require('../../models/userschema');


const categoryInfo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const searchQuery = search ? {
            name: { $regex: search, $options: 'i' }
        } : {};

        
        const categoryData = await Category.find(searchQuery)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        const totalCategories = await Category.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalCategories / limit);

        res.render('category', {
            cat: categoryData,
            currentPage: page,
            totalPages: totalPages,
            totalCategories: totalCategories,
            search: search
        });

    } catch (error) {
        console.error('Error in categoryInfo:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const addCategory=async(req,res)=>{
    

    try {
        const{name,description}=req.body

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
                                 
        console.log("-----------------------")

        if(existingCategory){
            return res.json({status:false,message:'Category already exists'})
        }

        const newCategory=new Category({
            name,
            description,
        })   

        console.log('++++++++++++++++_----------------',newCategory)
        
        await newCategory.save()
        console.log('save')
        return res.json({ status:true,message:'Category added successfully'});
    } catch (error) {
        console.log(error)
        console.error('Error in addCategory:', error);
        return res.status(500).json({ status:false,message:'Internal server error'})
        
    }
}




const listCategory = async (req, res) => {
    try {
        const id = req.body.id;
        console.log(id)
        console.log('------------------')
        console.log(req.body)
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: false, message: "Invalid category ID" });
        }
        
        const result = await Category.updateOne({ _id: id }, { $set: { isListed: true } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }
        res.json({ status: true, message: "Category unlisted successfully" });
    } catch (error) {
        console.error("Error in listCategory:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const unlistCategory = async (req, res) => {
    try {
        const id = req.body.id;
        console.log('unl;ist')
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ status: false, message: "Invalid category ID" });
        }
     
        const result = await Category.updateOne({ _id: id }, { $set: { isListed: false} });
        console.log('result',result)

        if (result.matchedCount === 0) {
            return res.json({ status: false, message: "Category not found" });
        }

    
        res.json({ status: true, message: "Category unlisted successfully" });
    } catch (error) {
        console.error("Error in unlistCategory:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const loadEditCategory = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)

        const category = await Category.findById(id);
        console.log(category)

        if (!category) {
            console.log("Category not found for ID:", id);
            return res.render("admin/edit-Category", { category: null, error: "Category not found." });
        }
        console.log('rendered')
        res.render("editCategory", {category }); 

    } catch (error) {
        console.error("Error loading category:", error);
        res.redirect("/pageNotfound");
    }
};

const editCategory = async (req, res) => {
    try {
        const id = req.params.id;        
        const { categoryName, description } = req.body;

        
        const existingCategory = await Category.findOne({
            name: categoryName,
            _id: { $ne: id }, 
        });

        if (existingCategory) {
            return res.status(400).json({ error: "Category name already exists, please choose another name" });
        }

        
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: categoryName, description: description },
            { new: true }
        );

        if (updatedCategory) {

            res.redirect('/admin/category');
            
        } else {
            res.status(404).json({ error: "Category not found" });
        }

    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};












module.exports={
    categoryInfo,
    addCategory,
    listCategory,
    unlistCategory,
    loadEditCategory,
    editCategory,
}