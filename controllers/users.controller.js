const db = require("../models");
const Users = db.users;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");

exports.getData = (req, res) => {
  res.send("sucess");
};

exports.registerUser = (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    dateOfBirth,
    phoneNo,
    role,
  } = req.body;

  const user_details = new Users({
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    password: password,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : "",
    phoneNo: phoneNo,
    role: role,
  });

  user_details
    .save()
    .then((data) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        // message: err.message,
        message: "User already exists Please login to countinue",
      });
    });
};

exports.fblogin = (req, res) => {
  const { email, name, accessToken } = req.body;

  Users.findOne({ email: email }, function (error, user) {
    if (user) {
      const token = jwt.sign(
        {
          email: email,
          id: user._id.valueOf(),
          lastLoggedInAt: new Date(),
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      Users.findById(user._id).then((val) => {
        res.status(200).send({
          success: true,
          token: token,
          lastlogin: val.lastLoggedInAt,
        });
      });
      Users.findByIdAndUpdate(user._id, {
        lastLoggedInAt: new Date(),
      }).exec();
    } else {
      axios
        .get(
          `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FB_CLIENT_ID}&client_secret=${process.env.FB_CLIENT_SECRET}&grant_type=client_credentials`
        )
        .then(({ data }) => {
          axios
            .get(
              `http://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${data?.access_token}`
            )
            .then(({ data }) => {
              if (req.body.userID === data.data.user_id) {
                const fullName = name.split(" ");
                const user_details = new Users({
                  firstName: fullName[0],
                  lastName: fullName[1],
                  email: email,
                  password: "",
                  fbAccessToken: accessToken,
                  loggedInWith: "Facebook",
                });

                user_details
                  .save()
                  .then((data) => {
                    const token = jwt.sign(
                      {
                        email: email,
                        id: data._id.valueOf(),
                        lastLoggedInAt: new Date(),
                      },
                      process.env.JWT_SECRET_KEY,
                      {
                        expiresIn: "1d",
                      }
                    );

                    Users.findById(data._id).then((val) => {
                      res.send({
                        success: true,
                        token: token,
                        lastlogin: val.lastLoggedInAt,
                      });
                    });
                    Users.findByIdAndUpdate(data._id, {
                      lastLoggedInAt: new Date(),
                    }).exec();
                  })
                  .catch((err) => {
                    res.status(500).send({
                      success: false,
                      message: err,
                    });
                  });
              }
            })
            .catch((err) =>
              res.status(401).send({ error: err.message, type: "debug_token" })
            );
        })
        .catch((err) => res.status(401).send(err.response.data));
    }
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  Users.findOne({ email: email }, (error, user) => {
    if (!error) {
      if (user) {
        user.comparePassword(password, (matchError, isMatch) => {
          if (matchError) {
            res
              .status(401)
              .send({ success: false, message: "Invalid Email or password" });
          } else if (!isMatch) {
            res
              .status(401)
              .send({ success: false, message: "Invalid Email or Password" });
          } else {
            const token = jwt.sign(
              {
                email: email,
                id: user._id.valueOf(),
                lastLoggedInAt: new Date(),
                name: user.firstName,
                role: user.role,
                profilePic: user.profilePic,
              },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "1d",
              }
            );

            Users.findById(user._id).then((val) => {
              // console.log("this is login pp ==>> ", val.profilePic);
              res.status(200).send({
                success: true,
                token: token,
                name: user.firstName,
                lastlogin: val.lastLoggedInAt,
                role: val.role,
                profilePic: val.profilePic,
              });
            });

            Users.findByIdAndUpdate(user._id, {
              lastLoggedInAt: new Date(),
            });
          }
        });
      } else {
        res
          .status(401)
          .send({ success: false, message: "User not found.Please Signup!!" });
      }
    } else {
      res.status(500).send({ success: false, message: error.message });
    }
  });
};

exports.genToken = (req, res) => {
  const { email } = req.body;
  Users.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(400).send({ success: false, message: "User not Found" });
      } else {
        const ForgotArray = ["Facebook", "Twitter", "Instagram"];

        if (ForgotArray.includes(user.loggedInWith)) {
          res.status(403).send({
            success: false,
            message: `You Logged in with ${user.loggedInWith}`,
          });
        } else {
          const token = crypto.randomBytes(32).toString("hex");
          Users.findByIdAndUpdate(user._id, {
            ftoken: token,
          })
            .then((val) => {
              res.status(200).send({ success: true, token: token });
            })
            .catch((err) =>
              res.status(403).send({ success: false, message: err.message })
            );
        }
      }
    })
    .catch((err) =>
      res.status(403).send({ success: false, message: err.message })
    );
};

exports.forgotPassword = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  Users.findOne({ ftoken: token }).then((user) => {
    if (!user) {
      res.status(400).send({
        success: false,
        message: "Token is expired please genrate new token.",
      });
    } else {
      const ftoken = crypto.randomBytes(32).toString("hex");
      user.password = password;
      user.ftoken = ftoken;
      user
        .save()
        .then((val) => {
          res.status(200).send({ success: true });
        })
        .catch((err) =>
          res.status(403).send({ success: false, message: err.message })
        );
    }
  });
};

exports.verifyemail = (req, res) => {
  console.log(req.body.email, "   ", process.env.SENDGRID_API_KEY);
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: req.body.email,
    from: "hitesh.gohil@safalvir.com",
    subject: "Verificarion for safalvir",
    text: "This is your verifiction link",
    html: `<strong>Click here</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.status(200).send({ success: true, message: "Email sent" });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ success: false, message: error });
    });
};

exports.profilepic = (req, res) => {
  Users.findByIdAndUpdate(req.user.id, {
    profilePic: req.file.filename,
  })
    .then((data) => {
      // console.log({ success: true, data: data, profilePic: req.file.filename });
      res
        .status(200)
        .send({ success: true, data: data, profilePic: req.file.filename });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.editPersonalDetails = (req, res) => {
  const { firstName, lastName, gender, dateOfBirth, phoneNo } = req.body;
  Users.findByIdAndUpdate(req.user.id, {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    dateOfBirth: new Date(dateOfBirth),
    phoneNo: phoneNo,
  })
    .then((data) => {
      // console.log({ success: true, data: data, profilePic: req.file.filename });
      res.status(200).send({ success: true, message: "Details updated!!" });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.changePassword = (req, res) => {
  const { newPassword } = req.body;
  Users.findOne({ _id: req.user.id }).then((user) => {
    if (!user) {
      res.status(400).send({
        success: false,
        message: "Token is expired please genrate new token.",
      });
    } else {
      user.password = newPassword;
      user
        .save()
        .then((val) => {
          res.status(200).send({
            success: true,
            message: "Password updated successfully!!",
          });
        })
        .catch((err) =>
          res.status(403).send({ success: false, message: err.message })
        );
    }
  });
};

exports.getUser = (req, res) => {
  console.log("HEre ====>  ", req.user);

  Users.findOne({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        res.status(400).send({
          success: false,
          message: "Token is expired please genrate new token.",
        });
      } else {
        res.status(200).send({
          success: true,
          data: user,
        });
      }
    })
    .catch((err) =>
      res.status(403).send({ success: false, message: err.message })
    );
};
