const express = require('express');
const UserModel = require('../models/user_model');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

router.post("/auth/register", (req, res) => {
    const { name, email,userName, password} = req.body;
    if (!name || !password || !email || !userName) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    UserModel.findOne({ email: email})
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ name, email, password: hashedPassword,userName});
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully!" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post("/auth/login", (req, res) => {
    const { userName, email, password } = req.body;
    if (!password || (!userName && !email)) {
      return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
  
    // Function to find the user by userName or email
    const findUser = () => {
      if (userName) {
        return UserModel.findOne({ userName: userName });
      } else if (email) {
        return UserModel.findOne({ email: email });
      }
    };
  
    findUser()
      .then((userInDB) => {
        if (!userInDB) {
          return res.status(401).json({ error: "Invalid Credentials" });
        }
  
        bcryptjs.compare(password, userInDB.password)
          .then((didMatch) => {
            if (didMatch) {
              const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
              const userInfo = { "_id": userInDB._id, "userName": userInDB.userName, "fullName": userInDB.fullName };
              res.status(200).json({ result: { token: jwtToken, user: userInfo } });
            } else {
              return res.status(401).json({ error: "Invalid Credentials" });
            }
          }).catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  

module.exports = router;