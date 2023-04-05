const express = require("express");
const morgan = require("morgan");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

require("dotenv/config");

app.use(express.json());
app.use(morgan("tiny"));

const api = process.env.APP_URL;

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "Test",
    image: "img_url_1",
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  res.send(newProduct);
});

const client = new MongoClient(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("vastuenergy-db").collection("vastuenergy-db");
  // perform actions on the collection object
  client.close();
});

app.listen(PORT, () => {
  console.log("listening on PORT 3000");
});
