var express = require("express");
var router = express.Router();
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const authAdmin = require("../middleware/authAdmin");
const authUser = require("../middleware/authUser");

/* GET /api/v1/products */
router.get("/", async function (req, res, next) {
  try {
    // let {product_name, price, amount} = req.body
    // let newProduct = new products({
    //     product_name,
    //     price,
    //     amount,
    // })
    const products = await Product.find();
    return res.status(200).send({
      status: 200,
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

/* GET /api/v1/products/:id */
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await Product.findById(id);
    return res.status(200).send({
      status: 200,
      message: "get success",
      data: product,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "get fail",
      success: false,
    });
  }
});

/* POST /api/v1/products */
router.post("/", authAdmin, async function (req, res, next) {
  try {
    const { product_image, product_name, price, amount } = req.body;
    let newProduct = new Product({
      product_image,
      product_name,
      price,
      amount,
    });
    let product = await newProduct.save();
    return res.status(200).send({
      status: 200,
      message: "create success",
      data: product,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

/* PUT /api/v1/products/:id */
router.put("/:id", authAdmin, async function (req, res, next) {
  try {
    const { product_image, product_name, price, amount } = req.body;
    let id = req.params.id;
    let product = await Product.findByIdAndUpdate(id, {
      product_image,
      product_name,
      price,
      amount,
    });
    return res.status(200).send({
      status: 200,
      message: "update success",
      data: product,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "update fail",
      success: false,
    });
  }
});

/* DELETE /api/v1/products/:id */
router.delete("/:id", authAdmin, async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).send({
      data: product,
      message: "delete success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "delete fail",
      success: false,
    });
  }
});

//-------------------------USER-------------------------

/* GET /api/v1/products/:id/orders || /GET order by id */
router.get("/:id/orders", authUser, async function (req, res, next) {
  try {
    const id = req.params.id;
    const orders = await Order.findById(id);
    res.status(200).send({
      status: 200,
      message: "success",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

router.post("/:id/orders", authUser, async function (req, res, next) {
    const { quantity } = req.body;
    const id = req.params.id;
    
    try {
      const product = await Product.findById(id);
      if (!product) throw { status: 400, message: "Product not found" };
      if (product.amount < quantity)
        throw { status: 400, message: "Not enough quantity" };
      const totalPrice = product.price * quantity;
  
      const order = await Order.create({

        product_id: id,
        quantity,
        totalPrice,
      });
      product.amount -= quantity;
      await product.save();
      return res.status(200).send({
        data: order,
        message: "Create order successfully",
        success: true,
      });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message, error: true });
    }
  });


// /* POST /api/v1/products/:id/orders || POST Order by id*/
// router.post("/:id/orders", authUser, async function (req, res, next) {
//   const { customer_id, quantity } = req.body;
//   const id = req.params.id;
//   console.log("id",id,Product.id)
  
//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       res.status(400).send({
//         status: 400,
//         message: "Product not found",
//         success: false,
//       });
//     if (product.amount < quantity) {
//       res.status(400).send({    
//         status: 400,
//         message: "Not enough quantity",
//         success: false,
//     });
//     }

//     const order = await Order.create({
//       customer_id,
//       product_id: id,
//       quantity,
//     });
//     product.amount = product.amount - quantity;
//     await product.save();
//     res.status(200).send({
//       status: 200,
//       message: "create success",
//       data: order,
//       success: true,
//     });
//   }
//   } catch (error) {
//     res.status(500).send({
//       message: "create fail",
//       success: false,
//     });
//   }
// });

module.exports = router;
