const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pages");
router.get("/careers", pagesController.renderCareerPage);

router.get("/faqs", pagesController.renderFaqsPage);

router.get("/terms", pagesController.renderTermsPage);
router.get("/contact", pagesController.renderContactPage);

router.get("/about", pagesController.renderAboutPage);
router.get("/team", pagesController.renderTeamPage);

router.all("/jobs", pagesController.render404);

module.exports = router;
