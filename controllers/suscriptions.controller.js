const { mongoose } = require("../models");
const db = require("../models");
const Subscriptions = db.suscriptions;
const Users = db.users;
const s3 = require("../helpers/s3.helper");
const path = require("path");

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
    comments,
    isStandardAlert,
    customizedAlertMessage,
    isEnableAlerts,
    // userId,
    status,
  } = req.body;

  Subscriptions.findOne({
    subscriptionName: company,
    userId: req.user.id,
    status: "Active",
  }).then((data) => {
    if (data !== null) {
      res.send({ success: true, alreadyExists: true ,data });
    } else {
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
        comments: comments,
        isStandardAlert: isStandardAlert,
        customizedAlertMessage: customizedAlertMessage || "",
        isEnableAlerts: isEnableAlerts || false,
        userId: req.user.id,
        status: status,
      });

      sub_details
        .save()
        .then((data) => {
          if (req?.file?.filename === undefined) {
            res.status(200).send({ success: true });
          } else {
            s3.upload(
              path.join(__dirname, `../uploads/${req.file.filename}`),
              req.file.filename,
              "attachments"
            )
              .then((img) => {
                Subscriptions.findByIdAndUpdate(data._id, {
                  attachment: img,
                })
                  .then((data) => {
                    res
                      .status(200)
                      .send({ success: true, data: data, attachment: img });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      success: false,
                      message: err.message,
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  success: false,
                  message: err.message,
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message: err.message,
          });
        });
    }
  });
};

exports.savebulk = (req, res) => {
  Subscriptions.insertMany(req.body.values)
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "successfully inserted.",
      });
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
    .populate("company")
    .then((data) => {
      Users.findById({ _id: req.user.id }).then((val) => {
        res.status(200).send({
          success: true,
          data: data,
          email: req.user.email,
          name: req.user.name,
          lastLoggedInAt: req.user.lastLoggedInAt,
          role: req.user.role,
          profilePic: val.profilePic,
        });
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
  console.log(req.body);
  const id = req.body.id;
  const {
    frequency,
    trialDays,
    contractStartDate,
    nextBillingDate,
    status,
    amount,
    autoRenewal,
    comments,
    attachment,
    review
  } = req.body;

  Subscriptions.findByIdAndUpdate(id, {
    frequency: frequency,
    trialDays: trialDays,
    startDate: new Date(contractStartDate),
    nextBilling: new Date(nextBillingDate),
    status: status,
    amount: amount,
    autoRenewal: autoRenewal,
    // attachment:attachment,
    comments: comments,
    review : review
  })
    .then((data) => {
      s3.upload(
        path.join(__dirname, `../uploads/${req.file?.filename}`),
        req.file.filename,
        "attachments"
      )
        .then((img) => {
          Subscriptions.findByIdAndUpdate(data._id, {
            attachment: img,
          })
            .then((data) => {
              res.status(200).send({
                success: true,
                message: "successfully edited",
              })
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                message: err.message,
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message: err.message,
          });
        });

     
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.changeStatusSubscription = (req, res) => {
  const id = req.body.id;
  const { status } = req.body.values;

  Subscriptions.findByIdAndUpdate(id, {
    status: status,
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

exports.changeRatingSubscription = (req, res) => {
  const id = req.body.id;
  const { rating } = req.body.values;
  console.log("this is rating ==> ", rating);

  Subscriptions.findByIdAndUpdate(id,{ rating})
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "Recived Rating!!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};


exports.changeLikeSubscription = (req, res) => {
  const id = req.body.id;
  const { isLiked } = req.body.values;

  Subscriptions.findByIdAndUpdate(id, {isLiked})
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "Changed Like!!",
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
  Subscriptions.deleteMany({ _id: req.body.id })
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
