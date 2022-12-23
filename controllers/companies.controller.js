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

exports.getCompanies = (req, res) => {
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

exports.editCompanies = (req, res) => {
  const id = req.body.id;
  const {
    name,
    companyType,
    logo,
    website,
    price,
    description,
    popular,
    updatedBy,
  } = req.body;

  Company.findByIdAndUpdate(id, {
    name: name,
    companyType: companyType,
    logo: logo,
    website: website,
    price: price,
    description: description,
    popular: popular,
    updatedBy: updatedBy,
  })
    .then((data) => {
      console.log(data);
      res.status(200).send({
        success: true,
        message: "successfully edited company details !!!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};
