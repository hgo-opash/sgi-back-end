module.exports = (app) => {
  const router = require("express").Router();
  const users = require("../controllers/users.controller");
  const subscription = require("../controllers/suscriptions.controller");
  const company = require("../controllers/companies.controller");
  const Auth = require("../middleware/authentication");
  const Autho = require("../middleware/authorization");
  const { upload } = require("../middleware/upload");

  router.get("/", users.getData);

  router.post("/register", users.registerUser);
  router.post("/login", users.loginUser);

  router.post("/verifyemail", users.verifyemail);

  router.post("/fblogin", users.fblogin);

  router.post("/forgotpass", users.genToken);
  router.post("/verify/:token", users.forgotPassword);

  router.use(Auth.authentication);

  router.post("/profilepic", upload.single("profilepic"), users.profilepic);

  router.post("/savesubs", subscription.saveSubscriptionService);
  router.get("/getsubs", subscription.getSubscriptions);
  router.post("/deletsub", subscription.deleteSubscription);
  router.post("/deletall", subscription.deleteAllSubscriptions);
  router.post("/editsub", subscription.editSubscription);

  // router.get("/getsubs/:email", subscription.getSubscriptions);

  router.post("/savecompany", company.saveCompany);
  router.get("/getcompanies", company.getCompany);

  app.use("/", router);
};
