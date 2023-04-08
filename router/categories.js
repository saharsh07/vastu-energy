const { Category } = require("../model/Category");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  Category.find()
    .then((category) => {
      res.status(200).json({
        hasError: false,
        data: category,
      });
    })
    .catch((err) => {
      res.status(500).json({
        hasError: true,
        error: err,
      });
    });
});

router.get("/:id", (req, res) => {
  return Category.findById(req.params.id)
    .then((category) => {
      res.status(200).json({
        hasError: false,
        data: category,
      });
    })
    .catch((err) => {
      res.status(500).json({
        hasError: true,
        error: err,
      });
    });
});

router.post("/", (req, res) => {
  const category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });

  category
    .save()
    .then((createdCategory) => {
      res.status(201).json(createdCategory);
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
});

router.put("/:id", (req, res) => {
  return Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  )
    .then((category) => {
      if (category) {
        res.status(200).json({
          hasError: false,
          data: category,
          message: "The Category is Updated Successfully",
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Category Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
});

router.delete("/:id", (req, res) => {
  return Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        res.status(200).json({
          hasError: false,
          message: "The Category Has Been Successfully Deleted",
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Category Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
});

module.exports = router;
