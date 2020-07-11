var express = require("express");
var router = express.Router();
var Park = require("../models/park");
const park = require("../models/park");
var middleware = require("../middleware");

//shows all parks
router.get("/", (req, res) => {
    Park.find({}, (err, allParks) => {
        if (err) {
            console.log(err);
        } else {
            res.render("parks/index", {parks: allParks}); 
        }
    });
});

//add new parks
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var location = req.body.location;
    var description = req.body.description;
    var rating = req.body.rating;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPark = {name: name, image: image, location: location, description: description, rating: rating, author: author};
    
    Park.create(newPark, (err, newPark) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/parks");
        }
    });
});

//show form to create new park
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("parks/new");
});

//show info for one specific park
router.get("/:id", (req, res) => {
    Park.findById(req.params.id).populate("comments").exec(
        (err, foundPark) => {
            if (err || !foundPark) {
                req.flash("error", "Park not found");
                res.redirect("back"); 
            } else {
                res.render("parks/show", {park: foundPark});
            }
        }
    )
});

//edit park route
router.get("/:id/edit", middleware.checkParkOwnership, (req, res) => {
    Park.findById(req.params.id, (err, foundPark) => {
         res.render("parks/edit", {park: foundPark});
   }); 
});


//update park route
router.put("/:id", middleware.checkParkOwnership, (req, res) => {
    Park.findByIdAndUpdate(req.params.id, req.body.park, (err, updatedPark) => {
        if (err) {
            res.redirect("/parks");
        } else {
            res.redirect("/parks/" + req.params.id);
        }
    });
});

//give park new rating route
router.get("/:id/rating", (req, res) => {
    Park.findById(req.params.id, (err, foundPark) => {
        res.render("ratings/new", {park: foundPark});
    });
});

//adds rating
router.put("/:id/rating", (req, res) => {
    Park.findByIdAndUpdate(req.params.id, req.body.park, (err, updatedPark) => {
        if (err) {
            res.redirect("/parks");
        } else {
            updatedPark.ratings.push(req.body.park.rating);
            updatedPark.rating = Math.floor(calculateAvgRating(updatedPark.ratings));
            updatedPark.save();
            req.flash("success", "Successfully added rating!");
            res.redirect("/parks/" + req.params.id);
        }
    });
});

//destroy park route
router.delete("/:id", middleware.checkParkOwnership, (req, res) => {
    Park.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/parks");
        } else {
            req.flash("success", "Park has been deleted!");
            res.redirect("/parks");
        }
    });
});

let calculateAvgRating = (ratings) => {
    if (ratings.length == 0) {
        return 0;
    }
    var sum = 0;
    ratings.forEach((rating) => {
        sum+=rating;
    });
    return sum / ratings.length;
}

module.exports = router;
