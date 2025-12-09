const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");

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

// main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Go to /listings For Home Page");
});

//Index Route to show all listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//show Route to show details of a particular listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// app.get("/listings", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Sample Listing",
//     descrpition: "This is a sample listing description.",
//     price: 100,
//     location: "Sample Location",
//     country: "Sample Country",
//   });
//   await sampleListing.save();
//   console.log("Sample listing created");
//   res.send("Sucessfull");
// });