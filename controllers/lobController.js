let lobModel = require("../models/lobModel");
let validator = require("../validations")

let createLob = async function (req, res) {
  try {
    //get category name from the user
    let category_name = req.body.category_name;
    //run validation on lob
    if(!validator.isValid(category_name)){
      return res.status(400).send("enter a valid category name")
    }

    //create lob document
    let lobCreated = await lobModel.create({ category_name: category_name });

    return res.status(200).send({ msg: "LOB created", data: lobCreated });
  } catch (err) {
    res.status(500).send({ msg: err.msg });
  }
};

module.exports.createLob = createLob;
