const fs = require("fs");
const AWS = require("aws-sdk");

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const s3 = {
  upload: (file, fileName, folder = "profile") => {
    return new Promise((resolve, reject) => {
      try {
        const readStream = fs.createReadStream(file);

        const params = {
          Bucket: BUCKET_NAME,
          Key: `${folder}/${fileName}`,
          Body: readStream,
          ACL: "public-read",
        };

        s3bucket.upload(params, (err, data) => {
          readStream.destroy();
          fs.unlinkSync(file);
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = s3;
