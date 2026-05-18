const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        console.log("MongoDB Connected Successfully");

        const db = client.db('drivefleet-db');
        const carsCollection = db.collection('cars');


        app.get("/", (req, res) => {
            res.send("Server is running fine!");
        });

        app.get('/cars', async (req, res) => {
            const cars = [
                {
                    name: 'Car Name',
                    rent: 5000
                }
            ];

            res.status(201).json({
                status: 'success',
                data: cars
            })
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});