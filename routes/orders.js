var express = require("express");
var router = express.Router();
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const authUser = require("../middleware/authUser");
const authAdmin = require("../middleware/authAdmin");

/* GET /api/v1/orders | GET all orders*/
router.get("/", authUser,  async function (req, res, next) {
  
  try {
    let orders;
    console.log("Role:", req.user.role);
    if (req.user.role === "admin") {
      console.log("admin");
      orders = await Order.find()
        .populate({
          path: "customer_id",
          model: User,
          select: "username",
        })
        .populate({
          path: "product_id",
          model: Product,
          select: "product_name price amount",
        });
      console.log("orders", orders);
    }
    else {
      orders = await Order.find({ customer_id: req.user._id })
        .populate({
          path: "customer_id",
          model: User,
          select: "username",
        })
        .populate({
          path: "product_id",
          model: Product,
          select: "product_name price amount",
        });
    }
    return res.status(200).json({
      status: 200,
      message: "success",
      data: orders || [],
    });
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

module.exports = router;
