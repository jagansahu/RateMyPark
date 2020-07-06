const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Park = require("./models/park");
const Comment = require("./models/comment");
const User = require("./models/user"); 
const seedDB = require("./seeds");
const commentRoutes = require("./routes/comments");
const parkRoutes = require("./routes/parks");
const indexRoutes = require("./routes/index");
const { populate } = require("./models/park");
const { text } = require("body-parser");

//mongodb://localhost:27017/Rate_My_Park
mongoose.connect("mongodb+srv://jsahu:letitrip@cluster0.mrv4o.mongodb.net/<dbname>?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true })
    .then(res => console.log("Connected to DB"))
    .catch(err => console.log("ERROR:", err.message))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //makes sure .ejs file is added the name so the file can process correctly
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

app.use(require("express-session")({
    secret: "THE SUN WILL STILL RISE TMRW",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/parks", parkRoutes);
app.use("/parks/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`RateMyPark local server running on http://localhost:${3000}`));