// Reviews model
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let Reviews = new Schema({
    movieName: String,
    ratings: String,
    review : String,
    story: String,
    positives: String,
    negatives: String,
    technicalReview: String,
    verdict: String,
    updated_at: { type: Date, default: Date.now }
    });

    Reviews.plugin(passportLocalMongoose);
    
    
    module.exports = mongoose.model('reviews', Reviews);