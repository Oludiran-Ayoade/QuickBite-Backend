const express = require('express')
const router = express.Router()

// const displayScreen = require('../controllers/displayScreen')
const registerUser = require("../controllers/registerUser")
const signIn = require('../controllers/signIn')
const verifyToken = require('../middlewares/verifyToken')
const addProducts = require('../controllers/addProducts')
const updateProduct = require('../controllers/updateProduct')
const getProducts = require('../controllers/getProducts')
const deleteProducts = require('../controllers/deleteProducts')
const productCount = require('../controllers/productCount')
const forgetPassword = require('../controllers/forgetPassword')
const verifyOtp = require('../controllers/verifyOtp')
const resetPassword = require('../controllers/resetPassword')
const sendWelcomeMail = require('../controllers/sendWelcomeMail')
const getProductById = require('../controllers/getProductById')
const getRelatedProducts = require('../controllers/getRelatedProducts')
const addToCart = require('../controllers/addToCart')
const updateCart = require('../controllers/updateCart')
const removeFromCart = require('../controllers/removeFromCart')
const getCart = require('../controllers/getCart')
const Payment = require('../controllers/payment')
const AllUserInfo = require('../controllers/AllUserInfo')


// Authentication
router.post('/signup', registerUser)
router.post('/signin', signIn)

// Products
router.get('/getproducts', getProducts);
router.get('/productcount', productCount);
router.post('/forgot-password', forgetPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/send-email', sendWelcomeMail);
router.get('/getproducts/:id', getProductById);
router.get('/getproductsrelated', getRelatedProducts);
router.get('/getallusers', AllUserInfo);

// Cart
router.post('/addtocart', addToCart);
router.post('/updatecart', updateCart);
router.post('/removefromcart', removeFromCart);
router.get('/getcart/:userId', getCart);

// Payment
router.post('/checkout', Payment);


// Private Routes
// router.post('/admin', verifyToken, (req, res) => {
//     res.send('Admin Here!!!')
// })
router.post('/admin/addproducts', verifyToken, addProducts)
router.put('/admin/:productId', verifyToken, updateProduct)
router.delete('/admin/:productId',verifyToken, deleteProducts)

module.exports = router