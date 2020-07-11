var mongoose = require("mongoose");

//setting up schema for park
var parkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ratings: [
        {
            type: Number,
            required: "Please provide a rating (1-5).",
            min: 0,
            max: 5,
            default: 0,
        }
    ],
    rating: {
            type: Number,
            required: "Please provide a rating (1-5).",
            min: 0,
            max: 5,
            default: 0,
    },
    location: String,
    longitude: Number,
    latitude: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Park", parkSchema);
