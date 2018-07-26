let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');


let Marriage = new Schema({
    About: String,
    Lifestyle : {
        Name : String,
        Age  : String,
        MotherTongue : String,
        MaritalStatus : String,
        BodyType : String,
        Complexion  : String,
        Weight  : String,
        Height  : String,
        BloodGroup : String,
        PhysicalStatus : String,
        Diet  : String,
        ProfileCreatedBy : String,
        Smoke   : String,
        Drink   : String
    },
    Religious  : {
        TimeOfBirth : String,
        Religion   : String,
        Caste   : String,
        SubCaste  : String,
        DateOfBirth : String,
        Raasi  : String,
        PlaceOfBirth  : String
    },
    Education  : {
        Education   : String,
        Occupation   : String,
        Income  : String
    },
    Family: {
        FatherOccupation   : String,
        MothersOccupation   : String,
        Brothers   : String,
        Sisters    : String,
        MarriedBrothers   : String,
        MarriedSisters   : String
    },
    Partner: {
        Age :	String,
        MaritalStatus :	String,
        BodyType :	String,
        Complexion :	String,
        Height :	String,
        Diet :	String,
        KujadoshamManglik :	String,
        Religion :	String,
        Caste :	String,
        MotherTongue :	String,
        Education :	String,
        Occupation :	String,
        CountryOfResidence :	String,
        State :	String,
        ResidencyStatus : String,
    },
    Images : []
});

Marriage.plugin(passportLocalMongoose);


module.exports = mongoose.model('marriage', Marriage);
