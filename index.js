const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 3500;

// middleware usage
app.use(cors());
app.use(express.json());

// monodb connect with password and username
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgrh0ns.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const database = client.db("kiddosProducts").collection("products");

    app.post("/products", async (req, res) => {
      const body = req.body;
      // console.log(body);
      const result = await database.insertOne(body);
      res.send(result);
    });

    // const query = {};
            // const query = { price: {$gte: 50, $lte:150}};
            // db.InspirationalWomen.find({first_name: { $regex: /Harriet/i} })

       // const options = {
            //     // sort matched documents in descending order by rating
            //     sort: { 
            //         "price": sort === 'asc' ? 1 : -1
            //     }
                
            // };
    // addedToys
    // app.get("/addedToys", async (req, res) => {
    //   console.log(req.query.email);
    //   let query = {};
    //   if (req.query?.email) {
    //     query = { sellerEmail: req.query.email };
    //   }
    //   if (req.query.search) {
    //     query = {
    //       ...query,
    //       productName: { $regex: req.query.search, $options: "i" },
    //     };
    //   }
    //   const cursor = addedToys
    //     .find(query)
    //     .limit(parseFloat(req.query.limit || 20))
    //     .sort({
    //       price: req.query.sort === "acc" ? 1 : -1,
    //     });
    //   const result = await cursor.toArray();
    //   return res.send(result);
    // });

    app.get("/products", async (req, res) => {
      const sort = req.query.sort;
      const search = req.query.search;
      console.log(search);
      let query = {}
      if(search){
        query = {
          ...query,
          name: { $regex: search, $options: 'i'}
        }
      }
            
      const cursor = database.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/products/email", async (req, res) => {
      console.log(req.query.email);
      const query = { seller_email: req.query.email };
      const cursor = database.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/products", async (req, res) => {
        const id = req.query.id;
        console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = database.deleteOne(query);
      res.send(result);
    });


    // app.get("/products", async (req, res) => {
    //   console.log(req.query.email);
    //   const query = { seller_email: req.query.email };
    //   const cursor = database.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Kiddos. Baby Starting.....");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
