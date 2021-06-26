const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77ufn.mongodb.net/Bit-Tech?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const BlogCollection = client.db("Bit-Tech").collection("Blog");
  const AdminCollection = client.db('Bit-Tech').collection("Admin")
  // perform actions on the collection object

  app.get('/blog', (req, res) => {
    BlogCollection.find({})
      .toArray((err, service) => {
        res.send(service);

      })
  })

  app.post('/addblog', (req, res) => {
    const blog = req.body;
    BlogCollection.insertOne(blog)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const Admin = req.body;
    AdminCollection.insertOne(Admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/deleteblog/:id', (req, res) => {
    BlogCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0)
      })
  })

  app.get('/OrderById/:id', (req, res) => {
    BlogCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
        console.log(document);
        err && console.log(err)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password)
    AdminCollection.find({ email: email,password:password })
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
  })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})