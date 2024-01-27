const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	image: String,
	price: Number,
	location: String,
	country: String,
});

const listing = mongoose.model("listing", listingSchema);
modules.export = listing;
