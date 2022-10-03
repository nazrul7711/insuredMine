let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let policyModel = new mongoose.Schema({
  agent: {
    type: objectId,
    ref: "Agent",
  },
  policy_mode: {
    type: String,
  },
  policy_number: {
    type: String,
    unique: true,
  },
  premium_amt_written: {
    type: String,
  },
  policy_type: {
    type: String,
  },
  account_name: {
    type: objectId,
    ref: "Account",
    required:true
  },
  policy_start_date: {
    type: Date,
  },
  policy_end_date: {
    type: Date,
  },
  premium_amount: {
    type: Number,
  },
});

module.exports = mongoose.model("Policy", policyModel);
