let mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

let agentModel = new mongoose.Schema({
  agent: {
    type: String,
  },
  producer: {
    type: String,
  },
  agency_id: {
    type: String,
  },
  has_active_client: {
    type: String,
  },
  policy: [{ type: objectId, ref: "Policy" }],
});

module.exports = mongoose.model("Agent", agentModel);
