// news model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Gallery = new Schema({
  title: String,
  description: String,
  imageURL:[]
  
});

Gallery.plugin(passportLocalMongoose);


module.exports = mongoose.model('gallery', Gallery);
