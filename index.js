const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// mfs_service
// jasAnJrB8DA9C8kP
require('dotenv').config()
var cors = require('cors')
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9b6e9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const allUsersCollection = client.db("mfs_database").collection("allUsers");



    app.post('/allUsers', async (req, res) => {
      const user = req.body;
      console.log(user)
      // console.log(user)
      // insert email if user does not exist
      // you can do this many ways(1. email unique ,, 2. upsert ,, 3. simple checking)

      const query = { mobileNumber: user.mobileNumber }
      const existingUser = await allUsersCollection.findOne(query)
      if (existingUser) {
        res.send({ message: "number already used", insertedId: null })
      }
      const query1 = { email: user.email }
      const existingUser1 = await allUsersCollection.findOne(query1)
      if (existingUser1) {
        res.send({ message: "email already used", insertedId: null })
      }
      const result = await allUsersCollection.insertOne(user);
      // console.log(result)
      res.send(result)
    })

    app.get("/allUsers", async (req, res) => {
      const result = await allUsersCollection.find().toArray();
      res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('MFS server runnig')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})