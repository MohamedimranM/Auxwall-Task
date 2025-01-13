const express = require('express') 
const session = require('express-session'); 
const dotenv= require('dotenv')
const loginRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard')
const settingRoutes = require('./routes/settings')
const path = require('path')

const app = express()
// const PORT = process.env.PORT
dotenv.config()
const PORT= process.env.PORT
app.use(express.json())

// Set the view engine to EJS
app.set('view engine', 'ejs');  // Tells Express to use EJS templates for rendering HTML views
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies (URL encoded)
app.use(express.urlencoded({ extended: true }));

// Middleware to use session handling
app.use(session({
  secret: 'yourSecretKey', 
  resave: false,  
  saveUninitialized: false 
}));

// API routes
app.use('', loginRoutes)
app.use('', dashboardRoutes)
app.use('', settingRoutes)


// Start the server
app.listen(PORT, (req,res)=>{
    console.log(`The App is running on ${PORT}`)
})
