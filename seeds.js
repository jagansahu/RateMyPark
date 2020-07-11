var mongoose = require("mongoose");
var Park = require("./models/park");
var Comment = require("./models/comment");

//sample data 
//file not used in build of web application
var parks = [
    {
        name: "High Park",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTiLXG-FT-P_-8gUM9UfvkgUQj009ZIrXLjFg&usqp=CAU",
        description: "Highly recommend visiting during cherry blossom season, truly a must-see!"
    },
    {
        name: "Bon Echo Park",
        image: "https://www.frontenacnews.ca/media/k2/items/cache/d08e7b42e7bf9eeb70c787ab5d23eb59_XL.jpg",
        description: "You can jump off the park into a lake!! and it's absolutely stunning"
    },
    {
        name: "Berczy Park",
        image: "https://www.claudecormier.com/wordpress/wp-content/uploads/berczy-park-71.jpg",
        description: "Nice play to sit and and enjoy fountain and socialize."
    }
];

function seedDB() {
    Park.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } 
        console.log("removed parks");
        parks.forEach((seed) => {
            Park.create(seed, (err, park) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added park");
                    
                    Comment.create(
                        {
                            text: "This place is stunning!!",
                            author: "Jay"
                        }, (err, comment) => {
                            if (err) {
                                console.log(err);
                            } else {
                                park.comments.push(comment);
                                park.save();
                                console.log("new comment");
                            }
                        }
                    )
                }
            });
        });
    });
}

module.exports = seedDB;