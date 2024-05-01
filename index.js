require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', userRoutes);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(result => {
    console.log('connected to database')
    app.listen(3000);
  })
  .catch(err => {
    console.log('error connect to database', err);
  });