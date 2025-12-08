const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const MONGOO_URL = "mongodb://127.0.0.1:27017/WanderlustDB";

main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database initialized");
};

initDB().catch((err) => console.log(err));