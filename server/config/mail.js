let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

exports.sendMail = function (email,id) {
  let mailOptions = {
    from: '',
    to: email,
    subject: 'Plese verify your account',
    html:'<!DOCTYPE html><html lang="en"><head>'+
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></head>'+
    '<body><div class="container">'+
    '<div class="panel panel-success"><div class="panel-heading">Thanks for registering</div>'+
                    '<div class="panel-body">'+
                              '<p>Please verify your email and complete the sign up proccess</p>'+
                              '<h3>Here you Go !!</h3>'+
                              '<a href="https://mockin.herokuapp.com/#/verify/'+id+'" target ="_blank">Please Click Here</a>'+
                '</div><div class="panel-footer">Happy to see you</div></div></div></body></html>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
