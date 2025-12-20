const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../views/middleware");



//Index Route to show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route to show form to create new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route to add new listing to the database
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Created a new listing!");
    res.redirect("/listings");
  })
);

//Edit Route to show form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//show Route to show details of a particular listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Update Route to update a particular listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updateData = { ...req.body.listing };
    if (updateData.image && typeof updateData.image === "string") {
      updateData.image = {
        url: updateData.image.trim(),
        filename: "listingimage",
      };
    }
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", "Updated the listing!");
    res.redirect(`/listings/${id}`);
  })
); 

//Delete Route to delete a particular listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("error", "Deleted the listing!");
    res.redirect("/listings");
  })
);

module.exports = router;