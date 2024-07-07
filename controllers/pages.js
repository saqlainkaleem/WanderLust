const { faqs, cultureValues, jobOpenings } = require("../data/data");

module.exports.renderCareerPage = (req, res) => {
	res.render("careers.ejs", {
		cultureValues: cultureValues,
		jobOpenings: jobOpenings,
	});
};

module.exports.renderFaqsPage = (req, res) => {
	res.render("faqs.ejs", { faqs: faqs });
};

module.exports.renderTermsPage = (req, res) => {
	res.render("terms.ejs");
};

module.exports.renderContactPage = (req, res) => {
	res.render("contact.ejs");
};
module.exports.renderAboutPage = (req, res) => {
	res.render("about.ejs");
};

module.exports.renderTeamPage = (req, res) => {
	res.render("team.ejs");
};
module.exports.render404 = (req, res, next) => {
	res.render("404.ejs");
};
