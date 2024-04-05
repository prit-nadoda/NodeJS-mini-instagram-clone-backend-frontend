var express = require('express');
var router = express.Router();
var userModel = require("./users");
var postModel = require("./posts");
var passport = require("passport");
var localStrategy = require("passport-local");
var upload = require("./multer");


passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
  res.render('index', { footer: false });
});

router.get('/login', function (req, res) {
  res.render('login', { footer: false });
});

router.get('/register', function (req, res) {
  res.render('register', { footer: false });
});

router.get('/feed', isLoggedIn, async function (req, res) {
  var posts = await postModel.find().populate("user");
  console.log(posts)
  res.render('feed', { footer: true, posts });
});

router.get('/profile', isLoggedIn, async function (req, res) {
  var user = await userModel.findOne({ username: req.session.passport.user })
    .populate("posts")
  res.render('profile', { footer: true, user });
});

router.get('/search', isLoggedIn, function (req, res) {
  res.render('search', { footer: true });
});

router.get('/edit', isLoggedIn, async function (req, res) {
  var user = await userModel.findOne({ username: req.session.passport.user });
  res.render('edit', { footer: true, user });
});

router.get('/upload', isLoggedIn,function (req, res) {
  res.render('upload', { footer: true });
});

router.post('/register', function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email
  });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) {

});

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) { return next(err) }
    res.redirect("/login");
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { return next() };
  res.redirect("/login")
}

router.post("/update", upload.single("image"), async function (req, res) {
  var user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true });

  if (req.file) {
    user.profileImage = req.file.filename;
    await user.save();
  }

  res.redirect("/profile")
});

router.post("/upload", isLoggedIn, upload.single("image"), async function(req,res){
  var user = await userModel.findOne({username: req.session.passport.user });
  var post = await postModel.create({
    user: user._id,
    caption: req.body.caption,
    picture: req.file.filename
  });


  user.posts.push(post._id);
  await user.save();

  res.redirect("/feed")
})

module.exports = router;

