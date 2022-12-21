const { mongoose } = require("../models");
const db = require("../models");
const Countries = db.countries;

exports.getCountries = (req, res) => {
  Countries.find()
    .then((data) => {
      res.status(200).send({
        success: true,
        data: data,
      });
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        err: err.message,
      })
    );
};
