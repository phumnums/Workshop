const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({
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
        message: "Unauthorized. Please authenticate.",
        error: true,
      });

    if (user?.role !== "admin")
      return res
        .status(403)
        .json({ message: "Permission is denied", error: true });
    req.user = user.toObject();
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
    });
  }
};

module.exports = authAdmin;



// const authAdmin = async(req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
//         if (!user) {
//             return res.status(401).send({
//                 status: 401,
//                 message: 'Please authenticate.'
//             });
//         }
//         if (user.role !== 'admin') {
//             return res.status(401).send({
//                 status: 401,
//                 message: 'Please authenticate.'
//             });
//         }
//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(500).send({
//             message: 'create fail',
//             success: false,
//         })
//     }
// }

// module.exports = authAdmin
