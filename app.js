const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")

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

//Index Route to show all listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//New Route to show form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


//Create Route to add new listing to the database
app.post("/listings", wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route to show form to edit a listing
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//show Route to show details of a particular listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Update Route to update a particular listing
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let updateData = {...req.body.listing};
  if (updateData.image && typeof updateData.image === 'string') {
    updateData.image = { url: updateData.image.trim(), filename: 'listingimage' };
  }
  await Listing.findByIdAndUpdate(id, updateData);
  res.redirect(`/listings/${id}`);
});

//Delete Route to delete a particular listing
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  res.send("something went wrong");
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

