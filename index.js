const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send('Working');
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdiiu.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('concetion error', err);
  const collection = client.db("volunteer").collection("events");
  const oderCollection = client.db("volunteer").collection("oders");


  app.post('/addOder', (req, res) => {
      const newOder = req.body;
      oderCollection.insertOne(newOder)
      .then(result =>{
          res.send(result.insertedCount > 0);
      })
  })

  app.get('/oder', (req, res) => {
      oderCollection.find({email: req.query.email})
      .toArray((err, oder) => {
          res.send(oder);
      })
  })


  app.get('/events', (req, res) => {
      collection.find()
      .toArray((err, items) => {
          res.send(items);
      })
  })
  app.get('/checkout/:id', (req, res) => {
      collection.find({ _id:ObjectId(req.params.id)})
      .toArray((err, items) => {
          res.send(items);
      })
      
  })

  app.delete('/checkout/:id', (req, res) => {
      collection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result => {
          res.send(result.deletedCount > 0);
          res.redirect('/http://localhost:3000/manageProduct')
      })
  })

  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      collection.insertOne(newEvent)
      .then(result => {
          console.log("inserted image url", result.insertedCount)
          res.send(result.insertedCount > 0);
      })
  })
  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})