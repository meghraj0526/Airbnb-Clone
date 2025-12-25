const Listing = require("../models/listing");

//Index Route to show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//New Route to show form to create new listing
module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

//show Route to show details of a particular listing
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//Create Route to add new listing to the database
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Created a new listing!");
  res.redirect("/listings");
};

//Edit Route to show form to edit a listing
module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImage });
};

//Update Route to update a particular listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updateData = { ...req.body.listing };
  if (updateData.image && typeof updateData.image === "string") {
    updateData.image = {
      url: updateData.image.trim(),
      filename: "listingimage",
    };
  }
  let listing = await Listing.findById(id);
  let updatedListing = await Listing.findByIdAndUpdate(id, updateData);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Updated the listing!");
  res.redirect(`/listings/${id}`);
};

//Delete Route to delete a particular listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("error", "Deleted the listing!");
  res.redirect("/listings");
};
