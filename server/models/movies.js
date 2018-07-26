// Reviews model
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let Movies = new Schema({
    movieID: String,
    aboutMovie: String,
    Name:String,
    releaseDate: String,
    movieLength: String,
    teaserURL: String,
    trailerrURL: String,
    posterURL: String, 
    cast:{
        hero:String,
        heroIn:String,
        director:String,
        producer:String,
        vilan:String,
        others:String
    },
    images:[],
    videos:[],
    promos:[],
    ratings: String,
    updated_at: { type: Date, default: Date.now }
    });

Movies.plugin(passportLocalMongoose);
    
    
module.exports = mongoose.model('movieDetails', Movies);