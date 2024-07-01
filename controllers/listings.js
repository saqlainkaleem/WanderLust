const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { cloudinary } = require("../cloudConfig.js");
module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
	let response = await geocodingClient
		.forwardGeocode({
			query: req.body.listing.location,
			limit: 1,
		})
		.send();
	let url = req.file.path;
	let filename = req.file.filename;
	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	newListing.image = { url, filename };

	newListing.geometry = response.body.features[0].geometry;
	let savednewListing = await newListing.save();

	req.flash("success", "New Listing Created!");
	res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	const listingData = await Listing.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("owner");
	if (!listingData) {
		req.flash("error", "Listing you requested for does not exist!");
		res.redirect("/listings");
	} else res.render("./listings/show.ejs", { listingData });
};

module.exports.editListingForm = async (req, res) => {
	let { id } = req.params;

	const listingData = await Listing.findById(id);
	if (!listingData) {
		req.flash("error", "Listing you requested for does not exist!");
		res.redirect("/listings");
	}

	let originalImageUrl = listingData.image.url;
	originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

	res.render("./listings/edit.ejs", { listingData, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let response = await geocodingClient
		.forwardGeocode({
			query: req.body.listing.location,
			limit: 1,
		})
		.send();
	let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
	listing.geometry = response.body.features[0].geometry;
	await listing.save();
	if (typeof req.file !== "undefined") {
		let url = req.file.path;
		let filename = req.file.filename;
		cloudinary.uploader.destroy(listing.image.filename);
		listing.image = { url, filename };
		await listing.save();
	}
	req.flash("success", "Listing Updated!");
	res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	await Listing.findByIdAndDelete(id);

	cloudinary.uploader.destroy(listing.image.filename);
	req.flash("success", "Listing Deleted!");
	res.redirect("/listings");
};
