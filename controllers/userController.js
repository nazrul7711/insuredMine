const accountModel = require("../models/accountModel");
const policyModel = require("../models/policyModel");
const userModel = require("../models/userModel");
const validator = require("../validations");

const createUser = async function (req, res) {
  try {
    //extracting parameters from the browser
    let {
      userType,
      csr,
      email,
      gender,
      firstname,
      city,
      phone,
      address,
      state,
      zip,
      dob,
      policy,
      account_name,
    } = req.body;

    //running validations on parameter
    if (userType && !validator.isValid(userType)) {
      return res.status(400).send("entered userType is invalid");
    }
    if (csr && !validator.isValid(csr)) {
      return res.status(400).send("entered csr is invalid");
    }
    if (email && !validator.isValid(email)) {
      return res.status(400).send("entered email is invalid");
    }
    if (gender && !validator.isValid(gender)) {
      return res.status(400).send("entered gender is invalid");
    }
    if (firstname && !validator.isValid(firstname)) {
      return res.status(400).send("entered name is invalid");
    }
    if (city && !validator.isValid(city)) {
      return res.status(400).send("entered city is invalid");
    }
    if (phone && !validator.isValid(phone)) {
      return res.status(400).send("entered phone is invalid");
    }
    if (address && !validator.isValid(address)) {
      return res.status(400).send("entered address is not valid");
    }
    if (state && !validator.isValid(state)) {
      return res.status(400).send("entered state is not valid");
    }
    if (zip && !validator.isValid(zip)) {
      return res.status(400).send("entered zip is invalid");
    }
    if (dob && !validator.isValid(dob)) {
      return res.status(400).send("entered dob is invalid");
    }
    if (policy && validator.isValidObjectid(policy)) {
      let policyExist = await policyModel.findOne({ _id: policy });
      if (!policyExist) {
        return res.status(400).send("this policy does not exist");
      }
    }
    if (account_name && validator.isValidObjectid(account_name)) {
      let accountExist = await accountModel.findOne({ _id: account_name });
      if (!accountExist) {
        return res.status(400).send("this account name does not exist ");
      }
    }

    //after running validation make a object
    let validatedObject = {
      userType,
      csr,
      email,
      gender,
      firstname,
      city,
      phone,
      address,
      state,
      zip,
      dob,
      policy,
      account_name,
    };

    //create a document and push it into the data
    let userCreated = await userModel.create(validatedObject);
    return res
      .status(200)
      .send({ msg: "user created successfully", data: userCreated });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const getUser = async function (req, res) {
  try {
    //fetch details of the user
    let accountIdFromToken = req.userId;
    let userId = req.params.userId;

    //see if user exist
    const ifUserPresent = await userModel.findOne({
      _id: userId,
    });

    //if not return error
    if (!ifUserPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such user id in our records" });
    }
    // console.log(ifUserPresent);

    //we are fetching the policy details because we will fetch account name from policy
    let policy = await policyModel.findOne({
      _id: ifUserPresent.policy.toString(),
    }); 


    //if account name does not match than return error
    if (policy) {
      if (policy.account_name.toString() !== accountIdFromToken) {
        return res.status(403).send({
          status: false,
          msg: "you are not authorised to get these details",
        });
      }
    } else {
      return res
        .status(400)
        .send(
          "this user does not have a policy hence cant check his account details"
        );
    }

    //if all well then provide the details
    return res.status(200).send({ msg: "user found", data: ifUserPresent });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const updateUser = async function (req, res) {
  try {
    //get userid in paramters
    let accountIdFromToken = req.userId;
    let userId = req.params.userId;

    //extract parameters from body
    let {
      userType,
      csr,
      email,
      gender,
      firstname,
      city,
      phone,
      address,
      state,
      zip,
      dob,
      account_name,
      policy,
    } = req.body;

    //check if the user exist
    const ifUserPresent = await userModel.findOne({
      _id: userId,
    });

    if (!ifUserPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such user id in our records" });
    }

    //check if policy exist as we will verify the account name from the policy
    let policyExist = await policyModel.findOne({
      _id: ifUserPresent.policy.toString(),
    });
    if(policyExist){
      if (policyExist.account_name.toString() !== accountIdFromToken) {
        return res.status(403).send({
          status: false,
          msg: "you are not authorised to update these details",
        });
      }
    }
    
    //make empty object and add parameters to it if they are provided by the client and they are legit
    let modifibleObject = {};

    if (userType && validator.isValid(userType)) {
      modifibleObject.userType = userType;
    }
    if (csr && validator.isValid(csr)) {
      modifibleObject.csr = csr;
    }
    if (email && validator.isValid(email)) {
      modifibleObject.email = email;
    }
    if (gender && validator.isValid(gender)) {
      modifibleObject.gender = gender;
    }
    if (firstname && validator.isValid(firstname)) {
      modifibleObject.firstname = firstname;
    }
    if (city && validator.isValid(city)) {
      modifibleObject.city = city;
    }
    if (phone && validator.isValid(phone)) {
      modifibleObject.phone = phone;
    }
    if (address && validator.isValid(address)) {
      modifibleObject.address = address;
    }
    if (state && validator.isValid(state)) {
      modifibleObject.state = state;
    }
    if (zip && validator.isValid(zip)) {
      modifibleObject.zip = zip;
    }
    if (dob && validator.isValid(dob)) {
      modifibleObject.dob = dob;
    }
    //as policy and account_name are objects we have to chck if they are valid object ids
    if (policy && ifUserPresent.policy !== policy) {
      if (validator.isValidObjectid(policy)) {
        modifibleObject.policy = policy;
      }
    }
    if (account_name && ifUserPresent.account_name !== account_name) {
      if (validator.isValidObjectid(account_name)) {
        modifibleObject.account_name = account_name;
      }
    }

    //once validated update the record
    let modifiedObject = await userModel.updateOne(
      { _id: userId },
      modifibleObject
    );
    return res.status(200).send({
      msg: "user updated successfully",
      data: modifiedObject,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const deleteUser = async function (req, res) {
  try {
    //get user details
    let accountIdFromToken = req.userId;
    let userId = req.params.userId;

    //see if the user exist
    const ifUserPresent = await userModel.findOne({
      _id: userId,
    });

    if (!ifUserPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such user id in our records" });
    }

    //extract account name from the policy and check if it matches the user
    let policyExist = await policyModel.findOne({
      _id: ifUserPresent.policy.toString(),
    });

    if (policyExist.account_name.toString() !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to delete this record",
      });
    }

    // and if user exist and the account name matches too delete the record
    await userModel.deleteOne({ _id: userId });

    res.status(200).send({ msg: "the user is deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
