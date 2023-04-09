const { User } = require("../model/User");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get(`/`, async (req, res) => {
  User.find()
    .select("-passwordHash")
    .then((user) => {
      res.status(200).json({
        hasError: false,
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        hasError: true,
        error: err,
      });
    });
});

router.post("/register", async (req, res) => {
  const findUser = await User.findOne({
    email: req.body.email,
  });

  if (findUser) {
    return res.status(400).json({
      hasError: true,
      message: "The User is already exist",
    });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user
    .save()
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
});

router.get("/:id", (req, res) => {
  return User.findById(req.params.id)
    .select("-passwordHash")
    .then((user) => {
      res.status(200).json({
        hasError: false,
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        hasError: true,
        error: err,
      });
    });
});

router.put("/:id", (req, res) => {
  User.findById(req.params.id).then((findUser) => {
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = findUser.passwordHash;
    }
    updateUser(req, res, newPassword);
  });
});

router.post("/login", async (req, res) => {
  const findUser = await User.findOne({
    email: req.body.email,
  });

  if (!findUser) {
    res.status(404).json({
      hasError: true,
      message: "The User Not Found",
    });
  }

  if (
    findUser &&
    bcrypt.compareSync(req.body.password, findUser.passwordHash)
  ) {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        userId: findUser.id,
        isAdmin: findUser.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      hasError: false,
      message: "The user is authenticated",
      data: {
        token,
        user: findUser.email,
      },
    });
  } else {
    res.status(400).json({
      hasError: true,
      message: "Password is not authenticated",
    });
  }
});

function updateUser(req, res, newPassword) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.status(200).json({
          hasError: false,
          data: user,
          message: "The User is Updated Successfully",
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "User Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
}

module.exports = router;
