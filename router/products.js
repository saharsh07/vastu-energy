const { Product } = require("../model/Product");
const { Category } = require("../model/Category");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid File Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage });

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

router.post("/", uploadOptions.single("thumbnail"), (req, res) => {
  const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
  const file = req.file;
  if (!file) {
    return res.status(404).json({
      hasError: true,
      message: "The File Not Found In Request",
    });
  }
  const fileName = file.filename;
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discountPecentage: req.body.discountPecentage,
    rating: req.body.rating,
    stock: req.body.stock,
    brand: req.body.brand,
    category: req.body.category,
    thumbnail: `${basePath}${fileName}`,
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

router.put("/:id", uploadOptions.single("thumbnail"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      hasError: true,
      message: "Invalid Product",
    });
  }
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = product.thumbnail;
  }
  Category.findById(req.body.category).then((findCategory) => {
    if (!findCategory) {
      res.status(404).json({
        hasError: true,
        message: "The Category Not Found",
      });
    } else {
      updateProduct(req, res, imagePath);
    }
  });
});

function updateProduct(req, res, imagePath) {
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
      thumbnail: imagePath,
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

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const imagePaths = [];
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.filename}`);
      });
    }
    Product.findByIdAndUpdate(
      req.params.id,
      { images: imagePaths },
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
);

module.exports = router;
