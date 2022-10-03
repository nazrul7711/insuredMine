let policyModel = require("../models/policyModel");
let accountModel = require("../models/accountModel");
let validation = require("../validations");


const createPolicy = async function (req, res) {
  try {
    //get account detail
    let accountIdFromToken = req.userId;
    let accountIdFromParams = req.params.accountId;

    //check if the account exist
    const ifAccountPresent = await accountModel.findOne({
      _id: accountIdFromParams,
    });

    //if not return a error message
    if (!ifAccountPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such account id in our records" });
    }

    //if account exist then see if it matches with the token
    if (accountIdFromParams !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to create policy",
      });
    }

    //extract details from the body
    let {
      policy_mode,
      policy_number,
      premium_amt_written,
      premium_amount,
      policy_type,
      policy_start_date,
      policy_end_date,
      agent,
    } = req.body;

    let account_name = req.params.accountId;

    //running validation on parameters 
    if(policy_mode&&!validation.isValid(policy_mode)){
      return res.status(400).send("policy mode is not proper")
    }
    if (policy_number && validation.isValid(policy_number)) {
      let existingPolicy = await policyModel.findOne({
        policy_number: policy_number,
      });
      if(existingPolicy){
        return res.status(400).send("the policy already exist in our record")
      }
    }
    if (premium_amt_written && !validation.isValid(premium_amt_written)) {
      return res.status(400).send("premium amt written is not correct");
    }
    if (premium_amount && !validation.isValid(premium_amount)) {
      return res.status(400).send("premium amount is not correct");
    }
    if (policy_type && !validation.isValid(policy_type)) {
      return res.status(400).send("enter a valid policy type");
    }
    if (policy_start_date && !validation.isValid(policy_start_date)) {
      return res.status(400).send("enter a proper start date");
    }
    if (policy_end_date && !validation.isValid(policy_end_date)) {
      return res.status(400).send("enter a legit policy end date");
    }
    if (agent && !validation.isValid(agent)) {
      return res.status(400).send("agent name is not correct");
    }
    
    //create object consisting of validated parameters
    let validatedParams = {
      account_name,
      policy_mode,
      policy_number,
      premium_amt_written,
      premium_amount,
      policy_type,
      policy_start_date,
      policy_end_date,
      agent,
    };

    //create a document and push data into database with the validated paramters and return response
    let policyCreated = await policyModel.create(validatedParams);
    return res.status(200).send({ msg: "policy created", data: policyCreated });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const getPolicy = async function (req, res) {
  try {
    //extract details from the browser
    let accountIdFromToken = req.userId;
    let policyId = req.params.policyId;


    //fetch policy details and from this details get account name anmd cross check it with token account name
    const ifPolicyPresent = await policyModel.findOne({
      _id: policyId,
    });

    if (!ifPolicyPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such policy id in our records" });
    }



    if (ifPolicyPresent.account_name.toString() !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to get tis policy",
      });
    }
    //if the policy holder is the same person as account name then return response
    return res.status(200).send({ data: ifPolicyPresent });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const updatePolicy = async function (req, res) {
  try {
    //get details from the client
    let accountIdFromToken = req.userId;
    let policyId = req.params.policyId;

    //like above fetch account name from the policy and cross check it with account name given in the token
    const ifPolicyPresent = await policyModel.findOne({
      _id: policyId,
    });

    if (!ifPolicyPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such policy id in our records" });
    }

    if (ifPolicyPresent.account_name.toString() !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to modify this policy",
      });
    }

    //extract details user want to update
    let {
      policy_mode,
      policy_number,
      premium_amt_written,
      premium_amount,
      policy_type,
      policy_start_date,
      policy_end_date,
      account_name,
      agent,
    } = req.body;

    //run validation on parameters
    if (policy_mode && validation.isValid(policy_mode)) {
      ifPolicyPresent.policy_mode = policy_mode;
    }
    if (policy_number && validation.isValid(policy_number)) {
      if (validation.isValidObjectid(policy_number)) {
        ifPolicyPresent.policy_number = policy_number;
      }
    }
    if (premium_amt_written && validation.isValid(premium_amt_written)) {
      ifPolicyPresent.premium_amt_written = premium_amt_written;
    }
    if (premium_amount && validation.isValid(premium_amount)) {
      ifPolicyPresent.premium_amount = premium_amount;
    }
    if (policy_type && validation.isValid(policy_type)) {
      ifPolicyPresent.policy_type = policy_type;
    }
    if (policy_start_date && validation.isValid(policy_start_date)) {
      ifPolicyPresent.policy_start_date = policy_start_date;
    }
    if (policy_end_date && validation.isValid(policy_end_date)) {
      ifPolicyPresent.policy_end_date = policy_end_date;
    }
    if (account_name && validation.isValid(account_name)) {
      ifPolicyPresent.account_name = account_name;
    }
    if (agent && validation.isValid(agent)) {
      ifPolicyPresent.agent = agent;
    }

    // if above validation run fine then update and save the document
    await ifPolicyPresent.save();
    res.status(200).send({ msg: "policy modified", data: ifPolicyPresent });
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.msg });
  }
};

const deletePolicy = async function (req, res) {
  try {

    //get the details from the brwoser
    let accountIdFromToken = req.userId;
    let policyId = req.params.policyId;

    //check the details if the account name from the policy matches the account name given in the token
    const ifPolicyPresent = await policyModel.findOne({
      _id: policyId,
    });

    if (!ifPolicyPresent) {
      return res
        .status(404)
        .send({ status: false, msg: "no such policy id in our records" });
    }

    if (ifPolicyPresent.account_name.toString() !== accountIdFromToken) {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to delete this policy",
      });
    }

    // if the above checks are fine then delete the record
    await policyModel.deleteOne({ _id: policyId });
    res.status(200).send({msg:"policy deleted successfully"})
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.msg });
  }
};

module.exports.createPolicy = createPolicy;
module.exports.getPolicy = getPolicy;
module.exports.updatePolicy = updatePolicy;
module.exports.deletePolicy = deletePolicy;
