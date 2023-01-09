const express=require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('passport');



const users = require('./routes/api/user');

const app = express();


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// DB Config
const db = process.env.MongoURL;

// Passport middleware
app.use(passport.initialize());

// Connect to Mongoose
mongoose
  .connect(db)
  .then(() => console.log('Mongoose Connected'))
  .catch(err => console.log(err));


// Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

