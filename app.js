const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

const MONGOO_URL = "mongodb://127.0.0.1:27017/WanderlustDB";

main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOO_URL);
}

main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/listings", async (req, res) => {
  let sampleListing = new Listing({
    title: "Sample Listing",
    descrpition: "This is a sample listing description.",
    price: 100,
    location: "Sample Location",
    country: "Sample Country",
  });
  await sampleListing.save();
  console.log("Sample listing created");
  res.send("Sucessfull");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
