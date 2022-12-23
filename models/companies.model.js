const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Companies = Schema(
  {
    name: { type: String, required: true },
    companyType: {
      type: String,
      // enum: ["IT", "Banking", "Streaming", "Beauty & Fashion"],
      required: true,
    },
    description: { type: String, required: true },
    addedBy: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String, required: true },
    popular: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("mas_companies", Companies);
