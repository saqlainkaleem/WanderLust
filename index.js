const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const listings = require("./routes/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

app.use("/listings", listings);

//Review Post Route
app.post(
	"/listings/:id/reviews",
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
app.delete(
	"/listings/:id/reviews/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		res.redirect(`/listings/${id}`);
	})
);

app.get("/", (req, res) => {
	res.send("Hi, I am root.");
});

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found!"));
});
// Custom Error
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "something went wrong" } = err;
	res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
	console.log("Server is listening on port 8080");
});
