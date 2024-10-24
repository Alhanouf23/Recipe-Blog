const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
const authController = require('./server/controllers/authController');

const app = express();
const port = process.env.PORT || 2000;

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

// Set up cookie-parser
app.use(cookieParser('CookingBlogSecure'));

// Use method-override for PUT and DELETE
app.use(methodOverride('_method')); 

// Set up sessions
app.use(session({
  secret: 'CookingBlogSecretSession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Log requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

// Set up flash
app.use(flash());
app.use(fileUpload());

// Set up EJS
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Import routes
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

// Add login and signup routes
app.get('/login', (req, res) => {
  res.render('login'); // Render login page
});

app.post('/login', authController.login); // Handle login

app.get('/signup', (req, res) => {
  res.render('signup'); // Render signup page
});

app.post('/signup', authController.register); // Handle signup

// Add logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard'); // If there's an error, redirect to dashboard
    }
    res.redirect('/login'); // Redirect to login page
  });
});

// Error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err }); // Render error page
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
