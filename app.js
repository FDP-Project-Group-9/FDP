const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

//enabling cors
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.post('/api/users', (req, res, next) => {
  console.log('checking users api');
  res.status(201).json({msg: "success"});
  next();
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

