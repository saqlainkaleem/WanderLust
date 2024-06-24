module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl; //save redirectUrl if user is not loggedIn
		req.flash("error", "you must be logged in to create listing");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};
