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


const uploadAttachment = multer({ storage: storage , limits:  { fileSize: 2 * 1024 * 1024 } });

module.exports = { uploadAttachment };
