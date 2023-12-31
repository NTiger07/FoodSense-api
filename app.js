const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dontenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");


dontenv.config({ path: "./config/config.env" });
require("./config/passport")(passport); // Passport config
const PORT = process.env.PORT || 3000;

connectDB();
const app = express();

app.options("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", [
    "X-Requested-With",
    "content-type",
    "credentials",
  ]);
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.status(200);
  next();
});

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());


if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const { formatDate } = require("./helpers/hbs");

// HandleBars
app.engine(".hbs", exphbs({ helpers: {formatDate}, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Session middleware
app.use(
  session({
    secret: "foodsense",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));



const authRouter = require("./routes/oauth");
const requestRouter = require("./routes/request");
// Work on ensureAuth
app.use("/oauth", authRouter);
app.use("/request", requestRouter);

app.listen(
  PORT,
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`)
);
