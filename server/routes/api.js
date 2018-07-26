var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var path = require("path");
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dpei4n4kd',
  api_key: '182445716632865',
  api_secret: 'MSMdZ1as8CRp9OFG7YQ0W56R0jQ'
});

var User = require('../models/user.js');
var Reviews = require('../models/reviews.js');
var Movies = require('../models/movies.js');
var gallery = require('../models/gallery.js');
var Marriage = require('../models/marriage.js');
var verify = require('../config/verify.js');
var config = require('../config/config.js')
var mail = require('../config/mail.js');
var News = require('../models/news.js');
var DIR = path.resolve(__dirname, '..') + '\\uploads';
var upload = multer({ dest: DIR }).single('photo');

router.post('/upload', function (req, res) {
  var path = '';
  var imageData;
  var news = new News();
  upload(req, res, function (err) {
    console.log(req.body);
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured")
    }

    path = req.file.path;
    cloudinary.uploader.upload(path, { tags: 'basic_sample' })
      .then(function (image) {
        imageData = image.url;
        return res.status(200).json({
          data: image
        });
      })
      .catch(function (err) {
        if (err) { console.warn(err); }
      });


  });
});

router.post('/register', function (req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function (err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function () {
        mail.sendMail(req.body.username, req.user._id);
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err && typeof err != 'undefined') {
        return res.status(500).json({
          err: 'Could not log in user',
          reason: err
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        token: verify.getToken(user),
        userID: user._id,
        email: user.username,
        user: user
      });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

//user verification

router.route('/verify/:id').put(function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.send(err);
      console.log(err);
    }
    user.verified = true;
    user.save(function (err) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json({
        message: 'User Verified Please login!',
        restCall: 'success'
      });
    });

  });
});

//__________________ services

router.get('/users', verify.verifyOrdinaryUser, function (req, res, next) {
  // res.send('respond with a resource');
  User.find({}, function (err, users) {
    if (err) throw err;
    res.json(users);
  });
});

router.get('/get-news', function (req, res, next) {
  // res.send('respond with a resource');
  News.find({}, function (err, news) {
    if (err) throw err;
    res.json(news);
  });
});

router.post('/post-news', function (req, res, next) {
  var news = new News();
  if (req.body.title) {
    news.title = req.body.title;
  }
  if (req.body.description) {
    news.description = req.body.description;
  }
  if (req.body.imageURL) {
    news.imageURL = req.body.imageURL;
  }
  news.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        "succcess": "news Updated",
        "news": news
      });
    }
  });

});

router.route('/get-newsById/:id')
  .get(function (req, res) {
    News.findById(req.params.id, function (err, news) {
      if (err) {
        res.send(err);
      } else {
        res.json(news);
      }
    });
  });

router.route('/put-news/:id')
  .put(function (req, res) {
    News.findById(req.params.id, function (err, news) {
      if (err)
        res.send(err);
      console.log(req.body);
      if (req.body.title) {
        news.title = req.body.title;
      }
      if (req.body.description) {
        news.description = req.body.description;
      }
      if (req.body.imageURL) {
        news.imageURL = req.body.imageURL;
      }

      news.update(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            message: 'News Item updated!',
            news: news
          });
        }
      });
    });
  });

router.route('/delete-news/:id').delete(function (req, res) {
  News.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Successfully deleted' });
    }

  });
});
// for reviews

router.get('/get-reviews', function (req, res, next) {
  // res.send('respond with a resource');
  Reviews.find({}, function (err, reviews) {
    if (err) throw err;
    res.json(reviews);
  });
});

router.route('/post-reviews').
post(verify.verifyOrdinaryUser, function (req, res, next) {
  var reviews = new Reviews(req.body);
  reviews.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        "succcess": "reviews Updated",
        "reviews": reviews
      });
    }
  });

});

router.route('/get-reviewsById/:id')
  .get(function (req, res) {
    Reviews.findById(req.params.id, function (err, reviews) {
      if (err) {
        res.send(err);
      } else {
        res.json(reviews);
      }
    });
  });

router.route('/put-reviews/:id')
  .put(verify.verifyOrdinaryUser,function (req, res) {
    Reviews.findById(req.params.id, function (err, reviews) {
      if (err)
        res.send(err);
      console.log(req.body);
      Reviews.findOneAndUpdate({ "_id": req.params.id }, req.body, { upsert: true }, function (err, doc) {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send("succesfully saved");
        }
      });
    });
  });

router.route('/delete-reviews/:id')
.delete(verify.verifyOrdinaryUser,function (req, res) {
  Reviews.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Successfully deleted' });
    }

  });
});

//for Movies

router.get('/get-movies', function (req, res, next) {
  // res.send('respond with a resource');
  Movies.find({}, function (err, movies) {
    if (err) throw err;
    res.json(movies);
  });
}); 

router.post('/post-movies', function (req, res, next) {
  var movies = new Movies(req.body);
  movies.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        "succcess": "movies Updated",
        "movies": movies
      });
    }
  });

});

router.route('/get-moviesById/:id')
  .get(function (req, res) {
    Movies.findById(req.params.id, function (err, movies) {
      if (err) {
        res.send(err);
      } else {
        res.json(movies);
      }
    });
  });

router.route('/put-movies/:id')
  .put(function (req, res) {
    Movies.findById(req.params.id, function (err, movies) {
      if (err)
        res.send(err);
      console.log(req.body);
      Movies.findOneAndUpdate({ "_id": req.params.id }, req.body, { upsert: true }, function (err, doc) {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send("succesfully saved");
        }
      });
    });
  });

router.route('/delete-movies/:id').delete(function (req, res) {
  Movies.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Successfully deleted' });
    }

  });
});

//for gallery

router.get('/get-gallery', function (req, res, next) {
  // res.send('respond with a resource');
  Gallery.find({}, function (err, gallery) {
    if (err) throw err;
    res.json(gallery);
  });
});

router.post('/post-gallery', function (req, res, next) {
  var gallery = new Gallery(req.body);
  gallery.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        "succcess": "gallery Updated",
        "gallery": gallery
      });
    }
  });

});

router.route('/get-galleryById/:id')
  .get(function (req, res) {
    Gallery.findById(req.params.id, function (err, gallery) {
      if (err) {
        res.send(err);
      } else {
        res.json(gallery);
      }
    });
  });

router.route('/put-gallery/:id')
  .put(function (req, res) {
    Gallery.findById(req.params.id, function (err, gallery) {
      if (err)
        res.send(err);
      console.log(req.body);
      Gallery.findOneAndUpdate({ "_id": req.params.id }, req.body, { upsert: true }, function (err, doc) {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send("succesfully saved");
        }
      });
    });
  });

router.route('/delete-gallery/:id').delete(function (req, res) {
  Gallery.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Successfully deleted' });
    }

  });
});

//for Marriage

router.get('/get-marriage', function (req, res, next) {
  // res.send('respond with a resource');
  Marriage.find({}, function (err, marriage) {
    if (err) throw err;
    res.json(marriage);
  });
});

router.post('/post-marriage', function (req, res, next) {
  var marriage = new Marriage(req.body);
  marriage.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        "succcess": "marriage Updated",
        "marriage": marriage
      });
    }
  });

});

router.route('/get-marriageById/:id')
  .get(function (req, res) {
    Marriage.findById(req.params.id, function (err, marriage) {
      if (err) {
        res.send(err);
      } else {
        res.json(marriage);
      }
    });
  });

router.route('/put-marriage/:id')
  .put(function (req, res) {
    Marriage.findById(req.params.id, function (err, marriage) {
      if (err)
        res.send(err);
      console.log(req.body);
      Marriage.findOneAndUpdate({ "_id": req.params.id }, req.body, { upsert: true }, function (err, doc) {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send("succesfully saved");
        }
      });
    });
  });

router.route('/delete-marriage/:id').delete(function (req, res) {
  Marriage.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Successfully deleted' });
    }

  });
});

module.exports = router;
