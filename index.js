const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
        const bookingsCollection = db.collection('bookings');

        const verifyToken = (req, res, next) => {
            const authHeader = req.headers.authorization;
            console.log(authHeader);

            if (!authHeader) {
                return res.status(401).json({
                    status: "error",
                    message: "No authorization header found"
                });
            }

            const token = authHeader.split(" ")[1];
            console.log(token);

            if (!token) {
                return res.status(401).json({
                    status: "error",
                    message: "Authorization token not found!"
                });
            } else if (token !== "logged_in") {
                return res.status(401).json({
                    status: "error",
                    message: "Authorization token not valid!"
                });
            }
            next();
        }

        app.get("/", (req, res) => {
            res.send("Server is running fine!");
        });

        app.get('/featured', async (req, res) => {
            const cars = await carsCollection.find().limit(4).toArray();
            res.json({
                status: 'success',
                data: cars
            });
        })

        app.get('/cars', async (req, res) => {
            const cars = await carsCollection.find().toArray();

            res.json({
                status: 'success',
                data: cars
            })
        })
        app.post('/cars', async (req, res) => {
            const newCarData = req.body;
            // console.log("new Car Data: ", newCarData);

            const cars = await carsCollection.insertOne(newCarData);
            
            res.json({
                status: 'success',
                data: cars
            })
        })
        app.get('/cars/:id', async (req, res) => {
            const { id } = req.params;

            const car = await carsCollection.findOne({_id: new ObjectId(id)});

            res.json({
                status: 'success',
                data: car
            })
        })
        app.patch('/cars/:id', async (req, res) => {
            const { id } = req.params;
            const editedCarData = req.body;

            const updatedCarData = await carsCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: editedCarData}
            )

            res.json({
                status: 'success',
                data: updatedCarData
            })
        })
        app.delete('/cars/:id', async (req, res) => {
            const { id } = req.params;

            const result = await carsCollection.deleteOne({_id: new ObjectId(id)});

            res.json({
                status: 'success',
                data: result
            })
        })

        app.get('/bookings', async (req, res) => {
            const bookings = await bookingsCollection.find().toArray();

            res.json({
                status: 'success',
                data: bookings
            })
        })
        app.post('/bookings', async (req, res) => {
            const newBookingData = req.body;
            // console.log("new Booking Data: ", newBookingData);

            const cars = await bookingsCollection.insertOne(newBookingData);
            
            res.json({
                status: 'success',
                data: newBookingData
            })
        })
        app.get('/bookings/:id', async (req, res) => {
            const { id } = req.params;

            const bookingData = await bookingsCollection.findOne({_id: new ObjectId(id)});

            res.json({
                status: 'success',
                data: bookingData
            })
        })
        app.patch('/bookings/:id', async (req, res) => {
            const { id } = req.params;
            const editedBookingData = req.body;

            const updatedBookingData = await bookingsCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: editedBookingData}
            )

            res.json({
                status: 'success',
                data: updatedBookingData
            })
        })
        app.delete('/bookings/:id', async (req, res) => {
            const { id } = req.params;

            const result = await bookingsCollection.deleteOne({_id: new ObjectId(id)});

            res.json({
                status: 'success',
                data: result
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