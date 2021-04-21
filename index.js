const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuvex.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("This is my Database")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("finaldestination").collection("services");
    const orderCollection = client.db("finaldestination").collection("orders");
    const reviewCollection = client.db("finaldestination").collection("reviews");
    const adminCollection = client.db("finaldestination").collection("admins");
    console.log('Database Connected Successfully')


    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log("Adding new Service", newService);
        servicesCollection.insertOne(newService)
            .then(result => {
                console.log('Inserted Count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/services', (req, res) => {
        servicesCollection.find()
            .toArray((err, items) => {
                console.log("From Database", items);
                res.send(items);
            })
    })

    app.get('/service/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                console.log("From Database", documents);
                res.send(documents[0]);
            })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log("Getting New Order", newOrder);
        orderCollection.insertOne(newOrder)
            .then(result => {
                console.log('Inserted Count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find()
            .toArray((err, items) => {
                console.log("From Database", items);
                res.send(items);
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log("Adding new Review", newReview);
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('Inserted Count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                console.log("From Database", items);
                res.send(items);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log("Adding new Admin", newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log('Inserted Count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/reviews', (req, res) => {
        adminCollection.find()
            .toArray((err, items) => {
                console.log("From Database", items);
                res.send(items);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })

    app.get('/bookingList', (req, res) => {
        console.log(req.query.email)
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log("Deleting an Service", result.deletedCount)
                res.send(result.deletedCount > 0)
            })
    })

});

app.listen(port);