if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");



const listingsRoutes = require("./routes/listing");
const reviewsRoutes = require("./routes/review");
const userRoutes = require("./routes/user");



const MONGOO_URL = "mongodb://127.0.0.1:27017/WanderlustDB";



main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOO_URL);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httponly: true,
  }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware to pass flash messages to all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
