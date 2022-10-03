var mongoose = require("mongoose")

let postModel = new mongoose.Schema({
  agent:String,
  userType:String,
  policy_mode:Number,
  producer:String,
  policy_number:String,
  // premium_amount_written
  premium_amount:String,
  policy_type:String,
  company_name:String,
  category_name:String,
  policy_start_date:{
    type:Date
  },
  policy_end_date:{
    type:Date
  },
  csr:String,
  account_name:String,
  email:String,
  gender:String,
  firstname:String,
  city:String,
  account_type:String,
  phone:String,
  address:String,
  state:String,
  zip:String,
  dob:Date,
  // primary:String,



})



module.exports = mongoose.model("Post",postModel)