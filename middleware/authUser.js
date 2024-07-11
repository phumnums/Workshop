const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authUser = async (req, res, next) => {
  try {
    const token = req?.headers["authorization"]?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. Please authenticate.",
        error: true,
      });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(403).json({
        message: "Forbidden",
        error: true,
      });

    const user = await User.findOne({ _id: decoded._id });
    
    if (!user)
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. Please authenticate.",
        error: true,
      });
    req.user = user.toObject();
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
    });
  }
};

module.exports = authUser;

// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const authUser = async(req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         if(!token) {
//             res.status(401).send({
//                 status: 401,
//                 message: 'Unauthorized. Please authenticate.' });
//         }

//         const refershToken = req.cookies.refershToken
//         if(!refershToken) {
//             res.status(401).send({
//                 status: 401,
//                 message: 'Unauthorized. Please authenticate.'
//             })
//         }

//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         if(!decoded) {
//             res.status(401).send({
//                 status: 401,
//                 message: 'Unauthorized. Please authenticate.' });
//         }

//         const user = await User.findOne({ _id: decoded._id});
//         if (!user) {
//             res.status(401).send({
//                 status: 401,
//                 message: 'Unauthorized. Please authenticate.' });
//         }

//         req.user = user.toObject();
//         next();

//     } catch (error) {
//         res.status(500).send({
//             message: 'create fail',
//             success: false,
//         })
//     }
// }

// module.exports = authUser
