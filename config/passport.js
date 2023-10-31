const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  
  passport.use(
    new localStrategy((email, password, done) => {

      User.findOne({ email: email }, (err, user) => {
        if (err) throw err; 

        if (!user) return done(null, false); 

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err; 
          if (result === true) {
            return done(null, user);
          } else {
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
