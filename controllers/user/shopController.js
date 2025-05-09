const Category = require("../../models/catogerySchema");
const Product = require("../../models/productsSchema");

const getDefaultPriceRange = async () => {
    try {
        const maxPriceResult = await Product.aggregate([
            { $match: { isBlocked: false } },
            { $group: { _id: null, maxPrice: { $max: "$salePrice" } } },
        ]);
        return {
            minPrice: 0,
            maxPrice: maxPriceResult[0]?.maxPrice || 10000,
        };
    } catch (error) {
        console.error("Error getting price range:", error.message);
        return { minPrice: 0, maxPrice: 10000 };
    }
};



const getShopPage = async (req, res) => {
    try {
        const {
            page = 1,
            sort = 'default',
            category = '',
            minPrice = 0,
            maxPrice = Infinity,
            search = ''
        } = req.query;

        const limit = 9;
        const skip = (page - 1) * limit;

        let query = { isListed: true };

        if (category) {
            query.categoryId = category;
        }

        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        query.$or = [
            { offerprice: { $gte: minPrice, $lte: maxPrice } },
            { $and: [{ offerprice: 0 }, { price: { $gte: minPrice, $lte: maxPrice } }] }
        ];

        let sortOption = {};
        switch (sort) {
            case 'priceAsc':
                sortOption = { offerprice: 1, price: 1 };
                break;
            case 'priceDesc':
                sortOption = { offerprice: -1, price: -1 };
                break;
            case 'nameAsc':
                sortOption = { productName: 1 };
                break;
            case 'nameDesc':
                sortOption = { productName: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const products = await Product.find(query)
            .populate('categoryId')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const categories = await Category.find({ isListed: true }).lean();

        const priceRange = await Product.aggregate([
            { $match: { isListed: true } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: { $ifNull: ['$offerprice', '$price'] } },
                    maxPrice: { $max: { $ifNull: ['$offerprice', '$price'] } }
                }
            }
        ]);

        const priceRangeData = priceRange[0] || { minPrice: 0, maxPrice: 10000 };

        res.render('shop', {
            products,
            categories,
            currentPage: parseInt(page),
            totalPages,
            currentSort: sort,
            selectedCategory: category,
            currentMinPrice: parseFloat(minPrice),
            currentMaxPrice: maxPrice === Infinity ? priceRangeData.maxPrice : parseFloat(maxPrice),
            searchQuery: search,
            priceRange: priceRangeData
        });
    } catch (error) {
        console.error('Error in getShopPage:', error);
        res.status(500).send('Server Error');
    }
};




const loadProductDetails = async (req, res) => {
    try {
        const user = req.session.user;
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("categoryId").lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }

        

        res.render("singleProduct", {
            user,
            product,
            title: product.productName, // Use productName for consistency
        });
    } catch (error) {
       
        
    }
};

module.exports = {
   
    getShopPage,    
    loadProductDetails,
    getDefaultPriceRange,
};