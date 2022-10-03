let agentModel = require("../models/agentModel");
let validator = require("../validations");

const createAgent = async function (req, res) {
  try {
    //extract parameters from the body
    let { agent, producer, agency_id, has_active_client, policy } = req.body;

    //run validations
    if (agent && !validator.isValid(agent)) {
      return res.status(400).send("agent name is not valid");
    }

    if (producer && !validator.isValid(producer)) {
      return res.status(400).send("producer name is not valid");
    }

    if (agency_id && !validator.isValid(agency_id)) {
      return res.status(400).send("entered agency_id is not valid");
    }

    if (has_active_client && !validator.isValid(has_active_client)) {
      return res.status(400).send("entered detail is not valid");
    }

    //at the begining the agent will be created with empty array later on he can add policy to this array
    if (policy && validator.isValidObjectid(policy)) {
      policy = [];
    }

    //create object with the validated parameters
    let validatedParams = {
      agent,
      producer,
      agency_id,
      has_active_client,
      policy,
    };

    //create agent document and push into the database
    let createdAgent = await agentModel.create(validatedParams);

    return res.status(200).send({ msg: "agent created", data: createdAgent });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.msg });
  }
};

const updateAgent = async function (req, res) {
  try {
    let agentIdFromParams = req.params.agentId;

    const ifAgentPresent = await agentModel.findOne({
      _id: agentIdFromParams,
    });

    if (!ifAgentPresent) {
      res
        .status(404)
        .send({ status: false, msg: "no such agent id in our records" });
    }

    let { agent, producer, agency_id, has_active_client, policy } = req.body;

    //run validation on parameters
    if (agent && validator.isValid(agent)) {
      ifAgentPresent.agent = agent;
    }
    if (producer && validator.isValid(producer)) {
      ifAgentPresent.producer = producer;
    }
    if (has_active_client && validator.isValid(has_active_client)) {
      ifAgentPresent.has_active_client = has_active_client;
    }
    if (policy && validator.isValidObjectid(policy)) {
      ifAgentPresent.policy.push(policy);
    }
    if (agency_id && validator.isValid(agency_id)) {
      ifAgentPresent.agency_id = agency_id;
    }

    //if validation are ok then save the changes in the document
    await ifAgentPresent.save();

    return res
      .status(200)
      .send({ msg: "agent modified", data: ifAgentPresent });
  } catch (err) {
    res.status(500).send({ msg: err.msg });
  }
};

module.exports.createAgent = createAgent;
module.exports.updateAgent = updateAgent;
