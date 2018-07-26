// news model
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');


let News = new Schema({
  title: String,
  description: String,
  imageURL:{
    type: String
  }
});

News.plugin(passportLocalMongoose);


module.exports = mongoose.model('news', News);
