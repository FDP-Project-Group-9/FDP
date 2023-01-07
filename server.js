const express=require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongoose
mongoose
  .connect(db)
  .then(() => console.log('Mongoose Connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

