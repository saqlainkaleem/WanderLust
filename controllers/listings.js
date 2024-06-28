const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	await newListing.save();
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
	}
	res.render("./listings/show.ejs", { listingData });
};

module.exports.editListingForm = async (req, res) => {
	let { id } = req.params;
	const listingData = await Listing.findById(id);
	if (!listingData) {
		req.flash("error", "Listing you requested for does not exist!");
		res.redirect("/listings");
	}
	res.render("./listings/edit.ejs", { listingData });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndUpdate(id, { ...req.body.listing });
	req.flash("success", "Listing Updated!");
	res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndDelete(id);
	req.flash("success", "Listing Deleted!");
	res.redirect("/listings");
};