const { Product } = require("../model/Product");
const { Category } = require("../model/Category");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  Product.find()
    .then((product) => {
      res.status(200).json({
        hasError: false,
        data: product,
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
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).json({
        hasError: false,
        data: product,
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
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discountPecentage: req.body.discountPecentage,
    rating: req.body.rating,
    stock: req.body.stock,
    brand: req.body.brand,
    category: req.body.category,
    thumbnail: req.body.thumbnail,
    images: req.body.images,
  });
  Category.findById(req.body.category).then((findCategory) => {
    if (!findCategory) {
      res.status(404).json({
        hasError: true,
        message: "The Category Not Found",
      });
    } else {
      saveProduct(product, res);
    }
  });
});

function saveProduct(product, res) {
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
}

router.put("/:id", (req, res) => {
  Category.findById(req.body.category).then((findCategory) => {
    if (!findCategory) {
      res.status(404).json({
        hasError: true,
        message: "The Category Not Found",
      });
    } else {
      updateProduct(req, res);
    }
  });
});

function updateProduct(req, res) {
  Product.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPecentage: req.body.discountPecentage,
      rating: req.body.rating,
      stock: req.body.stock,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    },
    { new: true }
  )
    .then((product) => {
      if (product) {
        res.status(200).json({
          hasError: false,
          data: product,
          message: "The Product is Updated Successfully",
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Product Not Found",
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

router.delete("/:id", (req, res) => {
  return Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        res.status(200).json({
          hasError: false,
          message: "The Product Has Been Successfully Deleted",
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Product Not Found",
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
