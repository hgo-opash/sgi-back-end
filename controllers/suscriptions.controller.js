const { mongoose } = require("../models");
const db = require("../models");
const Subscriptions = db.suscriptions;
const Users = db.users;

exports.saveSubscriptionService = (req, res) => {
  const {
    company,
    companyId,
    description,
    frequency,
    trialDays,
    contractStartDate,
    nextBillingDate,
    amount,
    autoRenewal,
    isStandardAlert,
    customizedAlertMessage,
    isEnableAlerts,
    // userId,
    status,
  } = req.body;

  const sub_details = new Subscriptions({
    subscriptionName: company,
    company: companyId,
    description: description,
    frequency: frequency,
    trialDays: trialDays || 0,
    startDate: contractStartDate,
    nextBilling: nextBillingDate,
    amount: +amount,
    autoRenewal: autoRenewal,
    isStandardAlert: isStandardAlert,
    customizedAlertMessage: customizedAlertMessage || "",
    isEnableAlerts: isEnableAlerts || false,
    userId: req.user.id,
    status: status,
  });

  sub_details
    .save()
    .then((data) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.getSubscriptions = (req, res) => {
  Subscriptions.find({ userId: req.user.id })
    .then((data) => {
      res.status(200).send({
        success: true,
        data: data,
        email: req.user.email,
        name: req.user.name,
        lastLoggedInAt: req.user.lastLoggedInAt,
        role: req.user.role,
        profilePic: req.user.profilePic,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.editSubscription = (req, res) => {
  const id = req.body.id;
  const { frequency, trialDays, contractStartDate, nextBillingDate, amount } =
    req.body.values;
  Subscriptions.findByIdAndUpdate(id, {
    frequency: frequency,
    trialDays: trialDays,
    startDate: new Date(contractStartDate),
    nextBilling: new Date(nextBillingDate),
    amount: amount,
  })
    .then((data) => {
      console.log(data);
      res.status(200).send({
        success: true,
        message: "successfully edited",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.deleteSubscription = (req, res) => {
  console.log(req.body);
  Subscriptions.deleteMany({ _id: req.body })
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "successfully deleted.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

// exports.deleteAllSubscriptions = (req, res) => {
//   Subscriptions.remove({ userId: req.user.id })
//     .then((data) => {
//       res.status(200).send({
//         success: true,
//         message: "Successfully deleted all subscriptions !!!",
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         success: false,
//         message: err.message,
//       });
//     });
// };
