const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var UsersSchema = mongoose.Schema(
  {
    profilePic: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false},
    budget: { type: String },
    dateOfBirth: { type: Date },
    phoneNo: { type: Number },
    lastLoggedInAt: { type: Date },
    ftoken: { type: String, select: false },
    role: {
      type: String,
      enum: ["admin", "business", "user"],
      default: "user",
    },
    fbAccessToken: { type: String, select: false },
    loggedInWith: {
      type: String,
      enum: ["Instagram", "Facebook", "Twitter", "Email"],
      default: "Email",
    },
    otp: { type: Number, select: false },
    registered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UsersSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }
          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

UsersSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

module.exports = mongoose.model("mas_users", UsersSchema);
