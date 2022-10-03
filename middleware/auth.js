const jwt = require("jsonwebtoken");

const tokenValidator = async function (req, res, next) {
  try {
    let bearerHeader = req.headers["authorization"];
    if(!bearerHeader){
      return res.send("plz provide the header")
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return res
        .status(403)
        .send({ status: false, msg: "token for authentication is missing" });
    }

    let decodedToken = await jwt.verify(bearerToken, "insuredMine");
    if (!decodedToken) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "invalid authentication token in request",
        });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { tokenValidator };
