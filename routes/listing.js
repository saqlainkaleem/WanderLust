const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

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
router.get("/new", (req, res) => {
	res.render("./listings/new.ejs");
});

router.post(
	"/",
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new listing(req.body.listing);
		await newListing.save();
		res.redirect("/listings");
	})
);

//Edit Route
router.get(
	"/:id/edit",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing.findById(id);
		res.render("./listings/edit.ejs", { listingData });
	})
);

//Update Route
router.put(
	"/:id",
	validateListing,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndUpdate(id, { ...req.body.listing });
		res.redirect(`/listings/${id}`);
	})
);

//Delete Route
router.delete(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndDelete(id);
		res.redirect("/listings");
	})
);

// Show Route
router.get(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing.findById(id).populate("reviews");
		res.render("./listings/show.ejs", { listingData });
	})
);

module.exports = router;
