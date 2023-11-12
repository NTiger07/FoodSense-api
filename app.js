const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const dontenv = require("dotenv");
const morgan = require("morgan");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

dontenv.config({ path: "./config/config.env" });
require("./config/passport")(passport); // Passport config
const PORT = process.env.PORT || 3000;

connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // <-- location of the react app were connecting to
    credentials: true,
  })
);

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Session middleware
app.use(
  session({
    secret: "foodsense",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);


app.use(cookieParser("foodsense"));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));
app.use("/trash", require("./routes/trash"));
app.listen(
  PORT,
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`)
);
