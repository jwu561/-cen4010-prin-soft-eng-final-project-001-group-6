



const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Parse = require('parse/node');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Initialize Parse
Parse.initialize("ffumw6fRM9wPdWp8WaNRbziAcoTOKyFlSAEYIgwI", "uA0JxfBGBq7lZ0ZXxjIIrBI0SqdnHveV1YyHJh4M", "o9XDl5AvtU6h0566OHxbrVXsQXl9l2PNY22BtHQ9");
Parse.serverURL = "https://parseapi.back4app.com/";

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Timeclock API',
      version: '1.0.0',
    },
  },
  apis: ['timeclock.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));

/**
 * @swagger
 * /login:
 *  post:
 *    summary: User login using user id & password
 *    description: Use this to login clients
 *    parameters:
 *      - name: userId
 *        description: User's ID
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: password
 *        description: User's password
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful login
 *      400:
 *        description: Unsuccessful login - Missing username or password
 *      401:
 *        description: Unsuccessful login - Wrong username or password
 */
//Function for logging in
app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
  
    // Check if the username and password are provided
    if (!userId || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }
  
    try {
      // Use Parse to log in the user
      const user = await Parse.User.logIn(userId, password);
      // Successfully logged in
      res.status(200).json({ message: 'Successful login', user: user.toJSON() });
    } catch (error) {
      // Failed to log in (wrong username or password)
      res.status(401).json({ message: 'Wrong username or password' });
    }
  });

/**
 * @swagger
 * /signup:
 *  post:
 *    summary: User sign up
 *    description: Use this to sign up users
 *    parameters:
 *      - name: userId
 *        description: User's ID
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: email
 *        description: User's email
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: password
 *        description: User's password
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: firstName
 *        description: User's first name
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: lastName
 *        description: User's last name
 *        in: formData
 *        required: true
 *        schema:
 *          type: string 
 *    responses:
 *      201:
 *        description: Successfully created user
 *      400:
 *        description: Unsuccessful -- Missing required information
 *      409:
 *        description: Unsuccessful -- Username or email already in use
 */
  //Signing up user
  app.post('/signup', async (req, res) => {
    const { userId, email, password, firstName, lastName } = req.body;
  // Check if all required information is provided
  if (!userId || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required information' });
  }

  try {
    // Create a new Parse user and set properties
    const user = new Parse.User();
    user.set('username', userId);
    user.set('email', email);
    user.set('password', password);
    user.set('first_name', firstName);
    user.set('last_name', lastName);

    // Sign up the user
    await user.signUp();

    // Successfully signed up
    res.status(201).json({ message: 'Successfully created user' });
  } catch (error) {
    // Failed to sign up (username or email already in use)
    res.status(409).json({ message: 'Username or email already in use' });
  }
});
  
  // Call signUpUser() when you want to sign up a user
  // signUpUser();
  
  
  
const port = process.env.PORT || 5678;
app.listen(port, () => {
  console.log('Server is running...');
  console.log(`Webapp:   http://localhost:${port}/`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
});

//Timeclock.js

function updateRealTimeDate() {
  var currentDate = new Date();
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var day = daysOfWeek[currentDate.getDay()];
  var month = months[currentDate.getMonth()];
  var date = currentDate.getDate();
  var year = currentDate.getFullYear();
  var formattedDate = "It's " + day + ", " + month + " " + date + ", " + year;
  document.getElementById("realTimeDate").textContent = formattedDate;
}

updateRealTimeDate();
setInterval(updateRealTimeDate, 60000);

