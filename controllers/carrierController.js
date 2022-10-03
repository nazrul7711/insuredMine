let carrierModel = require("../models/carrierModel");
let validator = require("../validations");

let createCarrier = async function (req, res) {
  try {
    let { company_name, lob } = req.body;
    if (!validator.isValid(company_name)) {
      return res.status(400).send("entered company name is not valid");
    }
    if (!validator.isValidObjectid(lob)) {
      return res.status(400).send("entered lob in invalid");
    }

    let validatedObject = { company_name, lob };

    let createdCarrier = await carrierModel.create(validatedObject);

    return res
      .status(200)
      .send({ msg: "carrier created succussfully", data: createdCarrier });
  } catch (err) {
    return res.status(500).send({ msg: err.msg });
  }
};

module.exports.createCarrier = createCarrier;
