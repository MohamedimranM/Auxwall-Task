const express = require('express')
const router = express.Router()

const users = [
    { username: 'admin', password: 'admin123' },
  ];

// Route for rendering the login page
router.get('/', (req, res) => {
    res.render('login', { error: null }); 
});

// Route for handling form submission after login attempt
router.post('/login', (req, res) => {
  const { username, password } = req.body;  

  // Check if the username and password match the hardcoded users
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;  
    res.redirect('/dashboard');  
  } else {
    res.render('/', { error: 'Invalid credentials' });  
  }
});

// Route for logging out the user

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {  
      if (err) {
        return res.redirect('/dashboard');  
      }
      res.redirect('/', );  
    });
  });

  module.exports= router
