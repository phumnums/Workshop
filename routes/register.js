var express = require("express");
var router = express.Router();
var brcrypt = require("bcrypt");
const User = require("../models/userModel");

/* POST /api/v1/register */
router.post("/",  async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let hash = await brcrypt.hash(password, 10);
    console.log("Received data", { username, password });
    let newUser = new User({
      username,
      password: hash,
    });
    let user = await newUser.save();
    return res.status(200).send({
      status: 200,
      message: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

module.exports = router;
