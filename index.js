if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const emailRoutes = require("./routes/email.js");
const pagesRoutes = require("./routes/pages.js");
const MONGO_URL = process.env.MONGODB_URL;
const PORT = 8080;
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

const store = MongoStore.create({
	mongoUrl: MONGO_URL,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
});

store.on("error", () => {
	console.log("ERROR in MONGO SESSION STORE", error);
});
const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
	res.redirect("/listings");
});

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/contact", emailRoutes);
app.use("/", pagesRoutes);
//404 Page
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found!"));
});
// Custom Error
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "something went wrong" } = err;
	res.status(statusCode).render("error.ejs", { message });
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
