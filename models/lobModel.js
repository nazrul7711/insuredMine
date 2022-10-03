let mongoose = require("mongoose")

let lobModel  = new mongoose.Schema({
  category_name:{
    type:String
  }
})

module.exports = mongoose.model("Lob",lobModel)