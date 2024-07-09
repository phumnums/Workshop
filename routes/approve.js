var express = require("express");
const authAdmin = require("../middleware/authAdmin");
const User = require("../models/userModel");
var router = express.Router();

/* GET users listing. */
router.put("/:id", async function (req, res, next) {
  const userId = req.params.id;
  const user = await User.findById(userId);
  user.approved = true;
  await user.save();
  res.send(user);
});

/* get all users */
router.get("/", async function (req, res, next) {
  const users = await User.find();
  res.send(users);
});


module.exports = router;

//         try {
//                 let id = req.params.id
//                 let user = await User.findByIdAndUpdate(id, {
//                         approved: true
//                 })
//                 return res.status(200).send({
//                         status: 200,
//                         message: 'update success',
//                         data: user,
//                         success: true,
//                 })
//         }catch(error) {
//                 return res.status(500).send({
//                         message: 'create fail',
//                         success: false,
//                 })
//         }
//     });
