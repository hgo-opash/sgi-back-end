module.exports = (app) => {
  const router = require("express").Router();
  const users = require("../controllers/users.controller");
  const subscription = require("../controllers/suscriptions.controller");
  const company = require("../controllers/companies.controller");
  const countries = require("../controllers/countries.controller");
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

  router.post("/verifyphone", users.phoneNoVerification);

  router.get("/countries", countries.getCountries);

  // router.use(Auth.authentication);

  router.post(
    "/profilepic",
    Auth.authentication,
    upload.single("profilepic"),
    users.profilepic
  );

  router.get("/getuser", Auth.authentication, users.getUser);
  router.post(
    "/personaldetails",
    Auth.authentication,
    users.editPersonalDetails
  );
  router.post("/changepass", Auth.authentication, users.changePassword);

  router.post(
    "/savesubs",
    Auth.authentication,
    subscription.saveSubscriptionService
  );
  router.get(
    "/getsubs",
    Auth.authentication,
    Autho.authorization("user"),
    subscription.getSubscriptions
  );
  router.post(
    "/deletsub",
    Auth.authentication,
    subscription.deleteSubscription
  );
  // router.post("/deletall", subscription.deleteAllSubscriptions);
  router.post("/editsub", Auth.authentication, subscription.editSubscription);

  // router.get("/getsubs/:email", subscription.getSubscriptions);
  router.post(
    "/savecompany",
    Auth.authentication,
    Autho.authorization("business"),
    company.saveCompany
  );
  router.get(
    "/getcompanies",
    Auth.authentication,
    Autho.authorization(["user", "business", "admin"]),
    company.getCompanies
  );
  router.post(
    "/editcompany",
    Auth.authentication,
    Autho.authorization("business"),
    company.editCompanies
  );
  router.post(
    "/deletecompany",
    Auth.authentication,
    Autho.authorization(["business", "admin"]),
    company.deleteCompanies
  );

  app.use("/", router);
};
