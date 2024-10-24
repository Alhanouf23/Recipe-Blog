const bcrypt = require('bcrypt');
const User = require('../models/User'); 

// Registration function
exports.register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the email is already registered
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).render('signup', { error: 'Email is already registered' });
      }
  
      // Create a new user
      const newUser = new User({
        email,
        password: password // Store the password as plain text
      });
  
      // Save the user to the database
      await newUser.save();
      res.redirect('/login'); // Redirect to the login page after successful registration
    } catch (error) {
      res.status(500).render('signup', { error: 'Server error' });
    }
};
  
// Login function
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).render('login', { error: 'User not found' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).render('login', { error: 'Invalid credentials' });
      }
  
      // If the password is correct, create the session
      req.session.userId = user._id; // Store the user ID in the session
      req.session.email = user.email; // Store the email if needed
  
      // Redirect the user to the homepage
      res.redirect('/dashboard');
    } catch (error) {
      res.status(500).render('login', { error: 'Server error' });
    }
};
  
// Function to check if the user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
      return next(); // If the user is logged in, proceed to the requested page
    } else {
      res.redirect('/login'); // Redirect to the login page if not logged in
    }
};
