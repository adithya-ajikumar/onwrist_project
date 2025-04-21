const express=require("express");
const router=express.Router();
const admincontroller=require("../controllers/admin/admincontroller")
const customerController=require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController.js')
const productController = require('../controllers/admin/productController.js')
const upload=require('../middlewares/multer.js')


router.get("/login",admincontroller.loadlogin);
router.post("/login",admincontroller.login);
router.get("/dashboard",admincontroller.loadDashboard);
router.get('/customers',customerController.custermerInfo);
router.get("/category",categoryController.categoryInfo)
router.post('/listCategory',categoryController.listCategory);
router.post('/unlistCategory',categoryController.unlistCategory);
router.post('/addCategory',categoryController.addCategory)



router.post('/blockUser', admincontroller.blockUser);
router.post('/unblockUser', admincontroller.unblockUser);
router.post('/toggleUserStatus', admincontroller.toggleUserStatus);




router.get("/products",productController.getAllProducts);
router.get("/addproduct",productController.loadAddProduct);
router.post("/addproduct",upload.array('productImages', 4),productController.addProduct);
router.post("/editProduct/:id",upload.array('productImages', 4),productController.editProduct);
router.get('/editProduct',productController.loadEditProduct);
router.get('/blockProduct',productController.blockProduct);
router.get('/unblockProduct',productController.unblockProduct);
router.post('/deleteImage',productController.deleteSingleImg);

module.exports=router;