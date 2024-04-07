const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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
app.get(
	"/listings",
	wrapAsync(async (req, res) => {
		const allListings = await listing.find({});
		res.render("./listings/index.ejs", { allListings });
	})
);

//Create Route
app.get("/listings/new", (req, res) => {
	res.render("./listings/new.ejs");
});

app.post(
	"/listings",
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new listing(req.body.listing);
		await newListing.save();
		res.redirect("/listings");
	})
);

//Edit Route
app.get(
	"/listings/:id/edit",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing.findById(id);
		res.render("./listings/edit.ejs", { listingData });
	})
);

//Update Route
app.put(
	"/listings/:id",
	validateListing,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndUpdate(id, { ...req.body.listing });
		res.redirect(`/listings/${id}`);
	})
);

app.delete(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await listing.findByIdAndDelete(id);
		res.redirect("/listings");
	})
);

// Show Route
app.get(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listingData = await listing.findById(id);
		res.render("./listings/show.ejs", { listingData });
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
