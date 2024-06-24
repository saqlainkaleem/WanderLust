module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "you must logged in to create listing");
		return res.redirect("/login");
	}
	next();
};
