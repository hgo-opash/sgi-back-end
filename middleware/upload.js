"use strict";
const multer = require("multer");
const fs = require("fs");
const { slugify } = require("../utils/fn");
const path = require("path");

const folderName = path.join(__dirname, "../uploads");
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + slugify(file.originalname));
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = { upload };
