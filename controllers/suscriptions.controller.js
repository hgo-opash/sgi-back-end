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
  });

  console.log(sub_details);

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
  console.log("user ====> ", req.user);
  Subscriptions.find({ userId: req.user.id })
    .then((data) => {
      res.status(200).send({
        success: true,
        data: data,
        email: req.user.email,
        lastLoggedInAt: req.user.lastLoggedInAt,
        role: req.user.role,
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
  const { id, frequency, trialDays, startDate, nextBilling, amount } = req.body;
  Subscriptions.findByIdAndUpdate(id, {
    frequency: frequency,
    trialDays: trialDays,
    startDate: startDate,
    nextBilling: nextBilling,
    amount: amount,
  })
    .then((data) => {
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
  // Subscriptions.find({ id: req.body.id }).then((data) => {
  //   console.log(data);
  //   res.send(data);
  // });
  Subscriptions.findByIdAndDelete(req.body.id)
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
