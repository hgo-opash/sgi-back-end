const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Countries = Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  emoji: { type: String, required: true },
  unicode: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("mas_countries", Countries);
