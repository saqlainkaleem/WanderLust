const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

//Validate Review
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

//Review Post Route
router.post(
	"/",
	validateReview,
	wrapAsync(async (req, res) => {
		let Listing = await listing.findById(req.params.id);
		let newReview = new Review(req.body.review);

		Listing.reviews.push(newReview);

		await newReview.save();
		await Listing.save();

		res.redirect(`/listings/${Listing._id}`);
	})
);

//Review Delete Route
router.delete(
	"/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		res.redirect(`/listings/${id}`);
	})
);

module.exports = router;
