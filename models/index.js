const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
// db.users = require("./users.model")(mongoose);
db.users = require("./users.model");
db.suscriptions = require("./subscriptions.model");
db.companies = require("./companies.model");
db.countries = require("./countries.model");

module.exports = db;
