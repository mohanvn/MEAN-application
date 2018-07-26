// user model
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');


let User = new Schema({
  username: String,
  password: String,
  verified:{
    type:Boolean
  },
  name:{
    type: String
  },
  phone:{
    type: Number
  },
  skype:{
    type:String
  },
  education:
    []
  ,
  experience:
    []
  ,
  git: {
    type: String
  },
  linkedin: {
    type: String
  },
  webSite:{
    type:String
  },
  facebook:{
    type: String
  },
  twitter:{
    type: String
  },
  resume:{
    type: String
  },
  skills:{
    type: Array
  }
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);
