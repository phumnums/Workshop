var express = require("express");
var router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

router.post("/", async function (req, res, next) {
  //login
  const { username, password } = req.body;
  try {
    if (!username)
      return res.status(400).send({
        status: 400,
        message: "Username is required",
        data: [{ validUser }],
      });

    if (!password)
      return res.status(400).send({
        status: 400,
        message: "Password is required",
        data: [{ validUser }],
      });

    let validUser = await User.findOne({ username });
    if (!validUser)
      return res.status(400).send({ 
        status: 400,
        message: "Login Failed, Your username is not registered",
        data: [{ validUser }],
      });

    if (!validUser.approved)
      return res.status(400).send({
        status: 400,
        message: "Your account is not approved",
        data: [{ validUser }],
      });

    let isMatch = await bcrypt.compare(password, validUser.password);

    if (!isMatch)
      return res.status(400).send({
        status: 400,
        message: "Login Failed, Username or Password is incorrect",
        data: [{ validUser }],
      });

    const payload = {
      _id: validUser._id.toString(),
      username: validUser.username,
    };

    const access_token = createAccessToken(payload);
    const refresh_token = createRefreshToken(payload);
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1day
    });

    validUser = validUser.toObject();
    delete validUser.password;
    res.status(200).json({
      access_token,
      refresh_token,
      data: [{ ...validUser }],
      message: "Login successful",
      success: true,
    });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message, error: true });
  }
});

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};


const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = router;

// var express = require('express');
// var router = express.Router();
// const User = require("../models/userModel");
// var brcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// const cookie = require('cookie');

// /* POST /api/v1/ */
// router.post('/', async function(req, res, next) {
//     const {username, password} = req.body;
//     console.log(username, password)

//     try{
//         let validUser = await User.findOne({username});

//         if(!validUser.approved){
//             res.status(400).send({
//                 status: 400,
//                 message: "Your account is not approved",
//                 data: [{validUser}],
//             })
//         }

//         if(!validUser){
//             return res.status(400).send({
//                 status: 400,
//                 message: "Login Failed, Your username is not registered",
//                 data: [{validUser}],
//             })
//         }

//         // if(validUser && isMatch){
//         //     return res.status(200).send({
//         //         status: 200,
//         //         message: "Login Successfully",
//         //         data: [{validUser}],
//         //     })
//         // }else{
//         //     return res.status(400).send({
//         //         status: 400,
//         //         message: "Login Failed",
//         //         data: [{validUser}],
//         //     })
//         // }

//         let isMatch = await brcrypt.compare(password, validUser.password);

//         if(!isMatch){
//             return res.status(400).send({
//                 status: 400,
//                 message: "Login Failed, Username or Password is incorrect",
//                 data: [{validUser}],
//             })
//         }

//         const Access_Token = createAccessToken(payload)
//         const Refresh_Token = createRefreshToken(payload)
//         res.cookie('refershToken', Refresh_Token, {
//             httpOnly: true,
//             path: '/',
//             maxAge: 7*24*60*60*1000
//         })

//         validUser = validUser.toObject();
//         delete validUser.password;
//         return res.status(200).json({
//             data: [{...validUser}],
//             Access_Token,
//             Refresh_Token,
//             status: 200,
//             message: "Login Successfully",
//             data: [{validUser}],
//         })

//     }catch(error) {
//         return res.status(500).json({
//             message: "create fail",
//             success: false,
//         })
//     }
// });

// const createAccessToken = (payload) => {
//     return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
// }

// const createRefreshToken = (payload) => {
//     return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
// }

// module.exports = router;

//     // if(validUser && isMatch){
//     //     return res.status(200).send({
//     //         status: 200,
//     //         message: "Login Successfully",
//     //         data: [{validUser}],
//     //     })
//     // }else{
//     //     return res.status(400).send({
//     //         status: 400,
//     //         message: "Login Failed",
//     //         data: [{validUser}],
//     //     })
//     // }

// //     if(username === 'user'&& password === 'password'){
// //         res.status(200).send('Success')
// //     }
// //     else if(username === 'user'&& password !== 'password' || username !== 'user' && password === 'password'){
// //         res.status(400).send('Failure')
// //     }
// //     else{
// //         res.status(401).send('Unauthorized')
// //     }
// //   });

//   module.exports = router;
