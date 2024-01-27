const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const listing = require("./models/listing.js");
const path = require("path");

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

//Index Route
app.get("/listings", async (req, res) => {
	const allListings = await listing.find({});
	res.render("./listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
	res.render("./listings/new.ejs");
});

app.post("/listings", async (req, res) => {
	const newListing = new listing(req.body.listing);
	await newListing.save();
	res.redirect("/listings");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
	let { id } = req.params;
	const listingData = await listing.findById(id);
	res.render("./listings/show.ejs", { listingData });
});

app.get("/", (req, res) => {
	res.send("Hi, I am root.");
});

app.listen(8080, () => {
	console.log("Server is listening on port 8080");
});
