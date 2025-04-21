


const Product = require('../../models/productsSchema');
const Category = require('../../models/catogerySchema');
const mongoose = require('mongoose');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs') // Use promises for fs operations

const loadAddProduct = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('addProduct', { cat: categories });
    } catch (error) {
        console.error('Error loading add product page:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const {
            productName,
            description,
            brand,
            categoryId,
            price,
            offerprice,
            colorStock,
            returnpolicy,
            warranty,
            status
        } = req.body;

        console.log(req.body);
        console.log("Files:", req.files);

        // Validate required fields
        if (!productName || !description || !brand || !categoryId || !price || !colorStock || !status) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        // Validate colorStock
        const validColorStock = {
            silver: parseInt(colorStock.silver) || 0,
            gold: parseInt(colorStock.gold) || 0,
            black: parseInt(colorStock.black) || 0,
        };

        // Calculate totalStock
        const totalStock = Object.values(validColorStock).reduce((total, stock) => total + stock, 0);

        // Create an array to hold the image paths or URLs
        let productImages = [];

        // Check if req.files exists and is an array
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                // Assuming file.path contains the path to the saved image
                productImages.push(file.filename);
            });
        }
        console.log("Product Images:", productImages);

        // Create a new product
        const newProduct = new Product({
            productName,
            description,
            brand,
            categoryId,
            price,
            offerprice: offerprice || 0,
            colorStock: validColorStock,
            totalStock,
            returnpolicy: returnpolicy === 'true',
            warranty: warranty === 'true',
            status,
            productImage: productImages, // Save the productImages array
            isListed: true // Default value
        });

        // Save the product to the database
        await newProduct.save();

        console.log('Product added successfully:', newProduct);

        res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product', error: error.message });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const search = req.query.search || '';

        // Build search query
        const searchQuery = search ? {
            $or: [
                { productName: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const productData = await Product.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('categoryId') // Populate the categoryId field
            .exec(); // Use exec() to execute the query

        const totalProducts = await Product.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalProducts / limit);

        res.render('product', {
            data: productData,
            currentPage: page,
            totalPages: totalPages,
            search: search
        });

    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).render('error', { message: 'Internal server error' });
    }
};


const loadEditProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        console.log("Product ID:", productId);

        // Fetch the product details by ID
        const product = await Product.findById(productId);
        console.log("Product Details:", product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Fetch the categories
        const categories = await Category.find({});

        // Render the edit product page with the product details and categories
        res.render('editProduct', { product, cat: categories });
    } catch (error) {
        console.error('Error loading edit product page:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const editProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        console.log("file------------", req.files);

        // Fetch the existing product
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check for duplicate product name
        const existingProduct = await Product.findOne({
            productName: data.productName,
            _id: { $ne: id }
        });

        if (existingProduct) {
            return res.status(400).json({ error: "Product with this name already exists. Please try with another name" });
        }

        // Initialize images with existing images
        let images = product.productImage || [];

        // Handle image uploads and resizing
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const originalImagePath = req.files[i].path;
                const resizedFilename = "resized-" + req.files[i].filename;
                const resizedImagePath = path.join('public', 'Uploads', 'product-Images', resizedFilename);
                await sharp(originalImagePath).resize({ width: 440, height: 440 }).toFile(resizedImagePath);

                // Check for duplicate filenames
                if (!images.includes(resizedFilename)) {
                    images.push(resizedFilename);
                }
            }
        }

        // Update product fields
        product.productName = data.productName || product.productName;
        product.description = data.description || product.description;
        product.brand = data.brand || product.brand;
        product.categoryId = data.categoryId || product.categoryId;
        product.price = data.price || product.price;
        product.offerprice = data.offerprice || product.offerprice;
        product.productImage = images;
        product.returnpolicy = data.returnpolicy === 'true';
        product.warranty = data.warranty === 'true';
        product.status = data.status || product.status;

        // Update colorStock and calculate totalStock
        product.colorStock = {
            silver: parseInt(data.colorStock.silver) || product.colorStock.silver || 0,
            gold: parseInt(data.colorStock.gold) || product.colorStock.gold || 0,
            black: parseInt(data.colorStock.black) || product.colorStock.black || 0,
        };

        // Save the updated product
        await product.save();

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
    }
};




const blockProduct=async(req,res)=>{
    try {
        let id=req.query.id;
        await Product.updateOne({_id:id},{$set:{isBlocked:true}})
        res.redirect('/admin/products')

    } catch (error) {
        res.redirect('/pageNotFound')
       
    }
}


const unblockProduct=async(req,res)=>{
    try {
        let id=req.query.id;
        await Product.updateOne({_id:id},{$set:{isBlocked:false}})
        res.redirect('/admin/products')
    } catch (error) {
        res.redirect('/pageNotFound');
        
    }
}




const deleteSingleImg = async (req, res) => {
    try {
        const { imageNameToServer, productIdToServer } = req.body;

        console.log("Image Name to Server:", imageNameToServer);
        const product = await Product.findByIdAndUpdate(
            productIdToServer,
            { $pull: { productImage: imageNameToServer } }
        );


        console.log('=======1')
        
        const imagePath = path.join(__dirname, 'public','Uploads','product-Images', imageNameToServer);

        console.log("=======3",imagePath)

        if (fs.existsSync(imagePath)) {
            await fs.unlinkSync(imagePath);
            console.log(`Image deleted successfully: ${imageNameToServer}`);
        } else {
            console.log(`Image not found: ${imageNameToServer}`);
        }

        console.log('=======2');

        res.json({ status: true ,message:"Image deleted successfully"});

    } catch (error) {
        console.error('Error deleting image:', error);
        res.redirect('/pageNotFound');
    }
};

module.exports = {
    loadAddProduct,
    addProduct,
    getAllProducts,
    editProduct,
    loadEditProduct,
    blockProduct,
    unblockProduct,
    deleteSingleImg
};
