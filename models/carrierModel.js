let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let carrierModel = new mongoose.Schema({
  company_name: {
    type: String,
  },
  lob: {
    type: objectId,
    ref: "Lob",
  },
});

module.exports = mongoose.model("Carrier", carrierModel);
