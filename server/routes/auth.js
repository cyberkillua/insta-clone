const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const User = mongoose.model('User');
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const {JWT_TOKEN} = require("../confiq/keys")
const jwt = require("jsonwebtoken")
const verifyLogin = require("../middleware/verifyLogin")





router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "fill missing fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "email already exists" });
      }
      bcrypt.hash(password, 11).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          pic
        });
        user
          .save()
          .then((user) => {
            res.json({message: "successful"});
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please fill in the email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt.compare(password, savedUser.password)
    .then((doMatch) => {
      if (doMatch) {
        //  res.json({ message: "sign in sucessful" });
        const token = jwt.sign({_id: savedUser._id}, JWT_TOKEN)
        const {_id, email, name, followers, following, pic} = savedUser
        res.json({token, user:{_id, email, name, followers, following, pic}})

      } else {
        return res.json({ error: "Invalid email or password" });
      }
    }).catch(err=> {
        console.log(err)
    })
    
  });
});

module.exports = router;
