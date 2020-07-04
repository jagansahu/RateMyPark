var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Park = require("./models/park");
var Comment = require("./models/comment");
var User = require("./models/user"); 
var seedDB = require("./seeds");
var commentRoutes = require("./routes/comments");
var parkRoutes = require("./routes/parks");
var indexRoutes = require("./routes/index");
const { populate } = require("./models/park");
const { text } = require("body-parser");

mongoose.connect("mongodb://localhost:27017/Rate_My_Park", { useUnifiedTopology: true, useNewUrlParser: true })
    .then(res => console.log("Connected to DB"))
    .catch(err => console.log(err))

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