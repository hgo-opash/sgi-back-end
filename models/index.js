const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
// db.users = require("./users.model")(mongoose);
db.users = require("./users.model");
db.suscriptions = require("./subscriptions.model");
db.companies = require("./companies.model");

module.exports = db;
