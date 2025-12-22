const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../views/middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);

//New Route to show form to create new listing
router.get("/new", isLoggedIn, listingController.newForm);

router.route("/:id")
.get(wrapAsync(listingController.show))
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
)
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);


//Edit Route to show form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);



module.exports = router;
