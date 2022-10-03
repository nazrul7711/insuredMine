let mongoose = require("mongoose")

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectid = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

module.exports = {isValid,isValidObjectid,isValidRequestBody}
