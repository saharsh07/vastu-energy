const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 3000;

require("dotenv/config");

// ! CORS
app.use(cors());
app.options("*", cors());

// ! Middleware
app.use(express.json());
app.use(morgan("tiny"));

// ! Routes
const productRouter = require("./router/products");
const categoryRouter = require("./router/categories");
const api = process.env.APP_URL;

app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);

// ! Connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "vastuenergy-dummy",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// ! Server
app.listen(PORT, () => {
  console.log("listening on PORT 3000");
});
