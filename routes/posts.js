var mongoose = require("mongoose"); 

var postSchema = mongoose.Schema({
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" 
  },
  picture: String,
  date: {
    type: Date,
    default: Date.now
  },
  likes : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }]
});

module.exports = mongoose.model("post",postSchema);