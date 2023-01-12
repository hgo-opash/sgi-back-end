module.exports = (app) => {
  const router = require("express").Router();
  const users = require("../controllers/users.controller");
  const subscription = require("../controllers/suscriptions.controller");
  const company = require("../controllers/companies.controller");
  const countries = require("../controllers/countries.controller");
  const Auth = require("../middleware/authentication");
  const Autho = require("../middleware/authorization");
  const { upload } = require("../middleware/upload");
  const {uploadAttachment} = require("../middleware/upload.attachment")

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

  router.post(
    "/attachment",
    Auth.authentication,
    uploadAttachment.single("attachment"),
    users.attachment
  );

  router.post("/uploadcsv", Auth.authentication, users.uploadcsv);

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
    uploadAttachment.single("attachment"),
    subscription.saveSubscriptionService
  );

  router.post("/savebulk", Auth.authentication, subscription.savebulk);

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

  router.post("/editsub", Auth.authentication,uploadAttachment.single("attachment"), subscription.editSubscription);
  router.post("/changestatus", Auth.authentication, subscription.changeStatusSubscription);
  router.post("/changerating", Auth.authentication, subscription.changeRatingSubscription);
  router.post("/changelike", Auth.authentication, subscription.changeLikeSubscription);

  // router.get("/getsubs/:email", subscription.getSubscriptions);

  router.post(
    "/savecompany",
    Auth.authentication,
    Autho.authorization("business"),
    upload.single("logo"),
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
