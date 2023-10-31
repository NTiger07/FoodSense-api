const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  // Setting up passport with local strategy
  passport.use(
    new localStrategy((email, password, done) => {
      // Searching for user in the database by email
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err; // Handling errors
        if (!user) return done(null, false); // Returning if user not found
        // Comparing entered password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err; // Handling errors
          if (result === true) {
            // Returning the user object if passwords match
            return done(null, user);
          } else {
            // Returning false if passwords do not match
            return done(null, false);
          }
        });
      });
    })
  );

  // Serializing user to save session information
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  // Deserializing user to get session information
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        email: user.email,
      };
      cb(err, userInformation);
    });
  });
};
