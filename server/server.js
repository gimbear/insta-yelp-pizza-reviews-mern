require('dotenv').config();

//backend
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

//middleware
const cors = require('cors');
const bodyParser = require('body-parser');
const { requireAuth } = require('./middleware/auth');

//routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');

//utils
const upload = require('./util/multer');
const cloudinary = require('./util/cloudinary');

//express.js
const app = express();

//config
const uri = process.env.ATLAS_URI;
const port = process.env.PORT;

//middleware...
//middleware for parsing json objects
app.use(bodyParser.json({ limit: '30mb', extended: true }));
//app.use(bodyParser.json({ type: 'application/*+json' }));
//middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }));
//Cross Origin Resource Sharing
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

//middleware for better terminal logging
app.use(morgan('dev'));

//db
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('*** Connected to cloud DB ***');
});
app.listen(port, (req, res) => {
  console.log(`Server started on port: ${port}`);
});

//routes
app.use(authRoutes);
app.use('/user', userRoutes);
app.use('/pizza', pizzaRoutes);
//routes
