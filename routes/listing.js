const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

//Validate Listing
const validateListing = (req, res, next) => {
	const { error } = listingSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};
//Index Route
router.get(
	"/",
	wrapAsync(async (req, res) => {
		const allListings = await listing.find({});
		res.render("./listings/index.ejs", { allListings });
	})
);

//Create Route
router.get("/new", isLoggedIn, (req, res) => {
	res.render("./listings/new.ejs");
});

router.post(
	"/",
	isLoggedIn,
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new listing(req.body.listing);
		newListing.owner = req.user._id;
		await newListing.save();
		req.flash("success", "New Listing Created!");
		res.redirect("/listings");
	})
);

//Edit Route
router.get(
	"/:id/edit",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing.findById(id);
		if (!listingData) {
			req.flash("error", "Listing you requested for does not exist!");
			res.redirect("/listings");
		}
		res.render("./listings/edit.ejs", { listingData });
	})
);

//Update Route
router.put(
	"/:id",
	isLoggedIn,
	validateListing,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndUpdate(id, { ...req.body.listing });
		req.flash("success", "Listing Updated!");
		res.redirect(`/listings/${id}`);
	})
);

//Delete Route
router.delete(
	"/:id",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndDelete(id);
		req.flash("success", "Listing Deleted!");
		res.redirect("/listings");
	})
);

// Show Route
router.get(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing
			.findById(id)
			.populate("reviews")
			.populate("owner");
		if (!listingData) {
			req.flash("error", "Listing you requested for does not exist!");
			res.redirect("/listings");
		}
		res.render("./listings/show.ejs", { listingData });
	})
);

module.exports = router;
