const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const uri =
  "mongodb+srv://product-db:clSxjrApUV4iSYwC@cluster0.cyspe14.mongodb.net/?appName=Cluster0";

app.get("/", (req, res) => {
  res.send("Hello World!");
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

    // ONLY USE THE CORRECT DB & COLLECTION
    const database = client.db("product-db");
    const productCollection = database.collection("products");

    // GET all products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🔥 Server running at http://localhost:${port}`);
});
