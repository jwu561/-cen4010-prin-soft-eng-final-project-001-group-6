//Timeclock.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');
const os = require('os');
const Parse = require('parse/node');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Initialize Parse
Parse.initialize("ffumw6fRM9wPdWp8WaNRbziAcoTOKyFlSAEYIgwI", "uA0JxfBGBq7lZ0ZXxjIIrBI0SqdnHveV1YyHJh4M");
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
 *  get:
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
 *      - name: first name
 *        description: User's first name
 *        in: formData
 *        required: true
 *        schema:
 *          type: string
 *      - name: last name
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
  async function signUpUser() {
    const user = new Parse.User();
    user.set('username', 'A string');
    user.set('email', 'A string');
    user.set('first_name', 'A string');
    user.set('last_name', 'A string');
    user.set('password', '#Password123');
  
    try {
      let userResult = await user.signUp();
      console.log('User signed up', userResult);
    } catch (error) {
      console.error('Error while signing up user', error);
    }
  }
  
  // Call signUpUser() when you want to sign up a user
  // signUpUser();
  
  
  
const port = process.env.PORT || 5678;
app.listen(port, () => {
  console.log('Server is running...');
  console.log(`Webapp:   http://localhost:${port}/`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
});
