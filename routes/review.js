const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js");

//Review Post Route
router.post(
	"/",
	isLoggedIn,
	validateReview,
	wrapAsync(async (req, res) => {
		let Listing = await listing.findById(req.params.id);
		let newReview = new Review(req.body.review);
		newReview.author = req.user._id;
		Listing.reviews.push(newReview);

		await newReview.save();
		await Listing.save();
		req.flash("success", "New Review Created!");

		res.redirect(`/listings/${Listing._id}`);
	})
);

//Review Delete Route
router.delete(
	"/:reviewId",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Review Deleted!");
		res.redirect(`/listings/${id}`);
	})
);

module.exports = router;
