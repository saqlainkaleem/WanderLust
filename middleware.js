const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl; //save redirectUrl if user is not loggedIn
		req.flash("error", "you must be loggedIn");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl; //save the redirectUrl in local variable
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You are not the owner of this listing!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

