const accountModel = require("../models/accountModel");
const policyModel = require("../models/policyModel");
const userModel = require("../models/userModel");
const validator = require("../validations");
const jwt = require("jsonwebtoken");

const createAccount = async function (req, res) {
  try {
    //account_name,account_type,applicant_id,policy,user,password
    let { account_name, account_type, applicant_id, policy, user, password } =
      req.body;

    //run validations
    if (account_name && !validator.isValid(account_name)) {
      return res.status(400).send("account name is not valid");
    }

    if (account_type && !validator.isValid(account_type)) {
      return res.status(400).send("account type is not valid");
    }

    if (applicant_id && !validator.isValid(applicant_id)) {
      return res.status(400).send("applicant id is not valid");
    }

    if (password && !validator.isValid(password)) {
      return res.status(400).send("password is not valid");
    }
    //policy and user will be empty array
    if(policy){
      policy=[]
    }
    if(user){
      user=[]
    }

    //after running validation create object with validated parameters
    let validatedParameters = {
      account_name,
      account_type,
      applicant_id,
      policy,
      user,
      password,
    };

    //create document and push it into our database
    let accountCreated = await accountModel.create(validatedParameters);

    //send response to browser
    return res
      .status(200)
      .send({ msg: "user created successfully", data: accountCreated });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const allowLogin = async function (req, res) {
  //get details from the client
  let name = req.body.name;
  let password = req.body.password;

  // run validation on credentials
  if (!validator.isValid(password)) {
    return res.status(400).send({ status: false, msg: "Enter a password" });
  }

  //check if the record exist in our database
  const isUser = await accountModel.findOne({ account_name: name });

  //if not send him message
  if (!isUser) {
    return res.status(400).send({
      status: false,
      message: "we dont have user with this credentials",
    });
  }

  //create jwt token
  const token = await jwt.sign(
    {
      userId: isUser._id,
    },
    "insuredMine"
  );

  //send browser the token
  return res.status(200).send({
    status: true,
    message: "User login successful",
    data: { token },
  });
};

const getAccount = async function (req, res) {
  try {
    //get details from browser
    let accountIdFromToken = req.userId;
    let accountIdFromParams = req.params.accountId;

    //check if we have the account
    const ifAccountPresent = await accountModel.findOne({
      _id: accountIdFromParams,
    });

    //if not send him message that the account does not exist
    if (!ifAccountPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such account id in our records" });
    }

    //if the account exist but the id dos not match with the JWT token
    if (accountIdFromParams !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to fetch these details",
      });
    }

    //if above checks are ok then send him the data
    res.status(200).send({
      message: "Account profile details",
      data: ifAccountPresent,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const updateAccount = async function (req, res) {
  try {
    //getting account details
    let accountIdFromToken = req.userId;
    let accountIdFromParams = req.params.accountId;

    //check if the account is present in our database
    const ifAccountPresent = await accountModel.findOne({
      _id: accountIdFromParams,
    });

    //if not send him the message
    if (!ifAccountPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such account id in our records" });
    }

    //if account does not match the jwt token
    if (accountIdFromParams !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to update these details",
      });
    }

    //extract the details that account holder wants to modify
    let { account_name, account_type, policy, user, password, applicant_id } =
      req.body;

    //check the paramters client wants to update and that the parameter is valid
    if (account_name && validator.isValid(account_name)) {
      ifAccountPresent.account_name = account_name;
    }
    if (account_type && validator.isValid(account_type)) {
      ifAccountPresent.account_type = account_type;
    }
    if (applicant_id && validator.isValid(applicant_id)) {
      ifAccountPresent.applicant_id = applicant_id;
    }
    if (password && validator.isValid(password)) {
      ifAccountPresent.password = password;
    }

    //with policy and user we are presuming that if user is providing me a policy or user that does not exist in our record then to append it or if it exist remove it
    if (policy) {
      let ifPolicyExist = await policyModel.findOne({ _id: policy });

      if (!ifPolicyExist) {
        res
          .status(404)
          .send("the policy you entered doesn't exist in our record");
      }

      //if policy exist
      if (ifPolicyExist) {
        if (ifAccountPresent.policy.includes(policy)) {
          const index = ifAccountPresent.policy.indexOf(policy);
          ifAccountPresent.policy.splice(index, 1);
        } else {
          ifAccountPresent.policy.push(policy);
        }
      }
    }

    //same above logic with the user
    if (user) {
      let ifUserExist = await userModel.findOne({ _id: user });

      if (!ifUserExist) {
        res.status(404).send("this user is not in our records");
      }

      if (ifUserExist) {
        if (ifAccountPresent.user.includes(user)) {
          const index = ifAccountPresent.user.indexOf(user);
          ifAccountPresent.user.splice(index, 1);
        } else {
          ifAccountPresent.user.push(user);
        }
      }
    }

    //if above checks are ok  the modify the account and send the respond
    await ifAccountPresent.save();

    return res
      .status(200)
      .send({ msg: "account modified", data: ifAccountPresent });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const deleteAccount = async function (req, res) {
  try {
    //take parameters from the user
    let accountIdFromToken = req.userId;
    let accountIdFromParams = req.params.accountId;

    //see if we have this account
    const ifAccountPresent = await accountModel.findOne({
      _id: accountIdFromParams,
    });

    //if not return an error
    if (!ifAccountPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such account id in our records" });
    }

    //this route is protected hence check if the account matches the jwt token
    if (accountIdFromParams !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to delete this record",
      });
    }

    //if above checks are ok then delete the record
    if (ifAccountPresent) {
      await accountModel.deleteOne({ _id: accountIdFromParams });
    }
    res.status(200).send({
      msg: "record deleted",
    });
  } catch (err) {
    res.status(500).send({ msg: err.msg });
  }
};

module.exports.createAccount = createAccount;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.allowLogin = allowLogin;
