const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOO_URL = "mongodb+srv://meghrajkhanat:%23mekhanat0525@cluster0.jvxw6rh.mongodb.net/WanderlustDB?appName=Cluster0";

main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "69636afc437151ccaaaf6113",
  }));
  await Listing.insertMany(initdata.data);
  console.log("Database initialized");
};

initDB().catch((err) => console.log(err));
