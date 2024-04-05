var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instagram");

var userSchema = mongoose.Schema({
  username : {
    type: String,
    unique :true,
  },
  name : String,
  email: String,
  password: String,
  profileImage: String,
  bio : String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post" 
  }]
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);