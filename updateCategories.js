// updateCategories.js
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // adjust the path if needed

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to DB");

    const listings = await Listing.find({});

    for (let listing of listings) {
        listing.category = "Trending"; // or set randomly from the enum list
        await listing.save();
        console.log(`Updated listing ${listing._id} with category`);
    }

    console.log("All listings updated.");
    mongoose.connection.close();
}

main();
