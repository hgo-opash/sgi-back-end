const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Subcriptions = Schema(
  {
    subscriptionName: { type: String, required: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: "companies",
    },
    description: { type: String, required: true },
    frequency: {
      type: String,
      enum: ["Monthly", "Annually", "Trial"],
      required: true,
    },
    trialDays: { type: Number },
    startDate: { type: Date, required: true },
    nextBilling: { type: Date, required: true },
    amount: { type: Number, required: true },
    autoRenewal: { type: Boolean, default: false, require: true },
    comments: { type: String },
    isStandardAlert: { type: Boolean, default: false, require: true },
    customizedAlertMessage: { type: String },
    isEnableAlerts: { type: Boolean, default: false, require: true },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Subcriptions.index({ userId: 1, company: 1 }, { unique: true });

module.exports = mongoose.model("tra_subcriptions", Subcriptions);
