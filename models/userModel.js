let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let userModel = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  dob: {
    type: Date,
  },
  policy: {
    type: objectId,
    ref: "Policy",
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  csr: {
    type: String,
  },
  userType: {
    type: String,
  },
  account_name:{
    type:objectId,
    ref:"Account",
    required:true
  }
});

module.exports = mongoose.model("User", userModel);
