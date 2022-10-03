let express = require("express")
let userController = require("../controllers/userController")
let accountController = require("../controllers/accountController")
let policyController = require("../controllers/policyController")
let middle = require("../middleware/auth")
let agentController = require("../controllers/agentController")
let lobController = require("../controllers/lobController")
let carrierController = require("../controllers/carrierController")

let router = express.Router()


//user routes
router.post("/userRegister",userController.createUser)
router.get("/user/:userId",middle.tokenValidator, userController.getUser);
router.put("/userRegister/:userId",middle.tokenValidator, userController.updateUser);
router.delete("/userRegister/:userId",middle.tokenValidator, userController.deleteUser);


//account routes
router.post("/accountRegister", accountController.createAccount);
router.get("/account/:accountId", middle.tokenValidator,accountController.getAccount);
router.put("/accountUpdate/:accountId",middle.tokenValidator, accountController.updateAccount);
router.delete("/accountDelete/:accountId",middle.tokenValidator, accountController.deleteAccount);
router.get("/getToken",accountController.allowLogin)

//policy routes
router.post("/policyLogin/:accountId",middle.tokenValidator, policyController.createPolicy);
router.get("/policy/:policyId",middle.tokenValidator, policyController.getPolicy);
router.put("/policyUpdate/:policyId",middle.tokenValidator ,policyController.updatePolicy);
router.delete("/policyRemove/:policyId",middle.tokenValidator ,policyController.deletePolicy);


//agent route
router.post("/createAgent",agentController.createAgent)
router.put("/updateAgent/:agentId",agentController.updateAgent)

//lob route
router.post("/createLob",lobController.createLob)

//carrier route
router.post("/createCarrier",carrierController.createCarrier)


module.exports=router

