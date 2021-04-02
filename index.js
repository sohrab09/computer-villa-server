const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = 5000


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World! Im new here')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cyf7w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("computerVilla").collection("products");

app.get('/products', (req, res) =>{
  productCollection.find()
  .toArray((err, items) =>{
    res.send(items)
  })
})

app.get('/checkout/:id',(req,res)=>{
  productCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err,documents)=>{
    res.send(documents[0]);
  })
})


app.post('/addItem', (req, res) =>{
  const newItem = req.body;
  console.log('adding new item: ', newItem);
  productCollection.insertOne(newItem)
  .then(result => {
    console.log('inserted count',result.insertedCount);
    res.send(result.insertedCount > 0)
  })
})

  console.log("Database Connection Successfully");
  // client.close();
});


app.listen(process.env.PORT || port)
