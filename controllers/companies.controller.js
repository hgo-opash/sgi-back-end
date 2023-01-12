const s3 = require("../helpers/s3.helper");
const db = require("../models");
const Company = db.companies;
const path = require("path");

exports.saveCompany = (req, res) => {
  const { name, companyType, addedBy, website, price, description, popular } =
    req.body;
    // req.body.values;
 
    s3.upload(
    path.join(__dirname, `../uploads/${req.file.filename}`),
    req.file.filename,
    "logo"
  )
    .then((img) => {
      const company_details = new Company({
        name: name,
        companyType: companyType,
        // addedBy: addedBy || "test",
        addedBy : req.user.id,
        logo: img,
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
exports.deleteCompanies = (req, res) => {
  Company.deleteMany({ _id: req.body.id })
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
  } = req.body.values;

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
