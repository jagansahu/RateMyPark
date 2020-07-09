const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const session = require("express-session");
const Park = require("./models/park");
const Comment = require("./models/comment");
const User = require("./models/user"); 
const seedDB = require("./seeds");
const commentRoutes = require("./routes/comments");
const parkRoutes = require("./routes/parks");
const indexRoutes = require("./routes/index");
const { populate } = require("./models/park");
const { text } = require("body-parser");

//connects to DB
const url = process.env.DATABASEURL || "mongodb://localhost:27017/Rate_My_Park";
mongoose.connect(url,
    { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(res => console.log("Connected to DB"))
    .catch(err => console.log("ERROR:", err.message))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //makes sure .ejs file is added the name so the file can process correctly
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//authentication
app.use(session({
    secret: "keyboard",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//saves data 'globally' so it can be used in other files easily
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//routes
app.use("/", indexRoutes);
app.use("/parks", parkRoutes);
app.use("/parks/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`RateMyPark local server running on http://localhost:${ port }`));