const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./Routes/users')
const issues = require('./Routes/issues')
const projects = require('./Routes/projects')
const app = express();
const cors = require('cors');
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

app.use(bodyParser.json());
app.use(cors())
// CORS setup
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//   next();
// });

app.get('/', (req, res) => {
  res.send("hello welcone to rest api for pms");
});

app.use('/users', users);
app.use('/issues', issues);
app.use('/projects', projects);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
