if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = process.env.MONGODB_URL;

main()
	.then(() => {
		console.log("connected to DB");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
	await Listing.deleteMany({});
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "668a50d2161ec5d44ca2e56f",
	}));
	await Listing.insertMany(initData.data);
	console.log("Data was initialized");
};

initDB();
