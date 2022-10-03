let mongoose = require("mongoose")
let objectId = mongoose.Schema.Types.ObjectId

let accountModel = new mongoose.Schema({
  password:{
    type:String
  },
  account_name: {
    type: String,
  },
  account_type: {
    type: String,
  },
  applicant_id: {
    type: String,
  },
  policy: [{ type: objectId, ref: "Policy",  }],
  user:[{type:objectId,ref:"User"}]
});


module.exports = mongoose.model("Account",accountModel)








//categoryname==lob
//