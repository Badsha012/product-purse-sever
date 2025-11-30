const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

const uri =
  "mongodb+srv://product-db:clSxjrApUV4iSYwC@cluster0.cyspe14.mongodb.net/?appName=Cluster0";

app.get("/", (req, res) => {
  res.send("Server is Running");
});

// MongoDB Setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully!");

    const database = client.db("product-db");
    const productCollection = database.collection("products");

    // GET all products
    app.get("/products", async (req, res) => {
      try {
        const products = await productCollection.find().toArray();
        res.send(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
    });

    // GET single product by ID (FIXED)
    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;

        // FIX: _id string হলে ObjectId ব্যবহার করা যাবে না
        const query = { _id: id };

        const product = await productCollection.findOne(query);

        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
      } catch (error) {
        console.error("Single Product Fetch Error:", error);
        res.status(500).json({ error: "Server error" });
      }
    });

  } catch (error) {
    console.error("MongoDB Error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
