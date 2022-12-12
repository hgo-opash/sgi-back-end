const db = require("../models");
const Company = db.companies;

exports.saveCompany = (req, res) => {
  const {
    name,
    companyType,
    addedBy,
    logo,
    website,
    price,
    description,
    popular,
    status,
  } = req.body;

  const company_details = new Company({
    name: name,
    companyType: companyType,
    addedBy: addedBy,
    logo: logo,
    website: website,
    price: price,
    description: description,
    popular: popular,
  });

  company_details
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

exports.getCompany = (req, res) => {
  Company.find()
    .then((data) => {
      res.status(200).send({ success: true, data: data });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};
