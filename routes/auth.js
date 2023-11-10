const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(404).send("User not found");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        const userInformation = {
          email: req.user.email,
          id: req.user.id,
          firstname: req.user.firstName,
          lastname: req.user.lastName,
        };
        res.send(userInformation);
      });
    }
  })(req, res, next);
});


// Register Route
router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.email,
        password: hashedPassword,
      });

      await newUser.save();
      res.send(req.user);
    }
  });
});

module.exports = router;
