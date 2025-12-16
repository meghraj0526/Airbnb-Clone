const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const Review = require("./models/review");
// const { error } = require("console");

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

// main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Go to /listings For Home Page");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Index Route to show all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route to show form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route to add new listing to the database
app.post(
  "/listings", validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route to show form to edit a listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//show Route to show details of a particular listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Update Route to update a particular listing
app.put(
  "/listings/:id", validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updateData = { ...req.body.listing };
    if (updateData.image && typeof updateData.image === "string") {
      updateData.image = {
        url: updateData.image.trim(),
        filename: "listingimage",
      };
    }
    await Listing.findByIdAndUpdate(id, updateData);
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route to delete a particular listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
  })
);

//Review Create Route
//post
app.post("/listings/:id/reviews", async (req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
});


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
