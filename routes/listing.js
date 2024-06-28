const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//Create Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
	"/",
	isLoggedIn,
	validateListing,
	wrapAsync(listingController.createListing)
);

//Edit Route
router.get(
	"/:id/edit",
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.editListingForm)
);

//Update Route
router.put(
	"/:id",
	isLoggedIn,
	isOwner,
	validateListing,
	wrapAsync(listingController.updateListing)
);

//Delete Route
router.delete(
	"/:id",
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.deleteListing)
);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

module.exports = router;
