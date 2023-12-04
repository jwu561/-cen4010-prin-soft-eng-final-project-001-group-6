//Timeclock.js


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
app.use(express.static('./pages html'));
app.use(express.static('public'));


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
      const username = userId;
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
  
/**
 * @swagger
 * /logout:
 *  post:
 *    summary: User logout
 *    description: Use this to logout clients
 *    responses:
 *      200:
 *        description: Successful logout
 *      403:
 *        description: Error -- No user logged in
 */
// Logout endpoint
app.post('/logout', async (req, res) => {
  try {
    // Checks if the user is logged in
    const currentUser = Parse.User.current();
    if (currentUser) {
      // Logs out the current user
      await Parse.User.logOut();
      console.log('User logged out');
      res.status(200).json({ message: 'Successful logout' });
    } else {
      console.log('No user logged in');
      res.status(403).json({ message: 'No user logged in' });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    summary: Get user information
 *    description: Use this to look at user information
 *    parameters:
 *      - name: userId
 *        description: User's ID
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful 
 *      404:
 *        description: Error -- User not found
 */
app.get('/users/:userId', async (req, res) => {
  var userId = req.params.userId; // Fetching userId from request parameters
  const User = Parse.User;
  const query = new Parse.Query(User);

  try {
    let user = await query.get(userId);
    console.log('User found', user);
    res.status(200).json({ user: user.toJSON() }); // Sending the user data in the response
  } catch (error) {
    console.error('Error while fetching user', error);
    res.status(404).json({ message: 'User not found' }); // Sending error response if user not found
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all user information
 *     description: Use this to retrieve all user information
 *     responses:
 *       200:
 *         description: Successful retrieval of user information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Error - Users not found
 */
// Assuming 'user' contains the array of user objects
app.get('/users', async (req, res) => {
  const Users = Parse.Object.extend('Users');
  const query = new Parse.Query(Users);

  try {
    const results = await query.find(userId);
    const usersData = results.map(object => ({
      Username: object.get('username'),
      First_name: object.get('first_name'),
      Last_name: object.get('last_name'),
      Email: object.get('email'),
  
    
    }));
  
    res.json({ users: usersData }); // Sending schedules data back as JSON
  } catch (error) {
    console.error('Error while fetching Schedules', error);
    res.status(500).send('Error fetching schedules'); // Sending an error status and message back
  }
});



/**
 * @swagger
 * /classes/schedules:
 *   post:
 *     summary: Create schedules
 *     description: Used to create schedules
 *     parameters:
 *       - name: Employee
 *         description: Employee name
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: Week
 *         description: Work week
 *         in: formData
 *         required: true
 *         format: date
 *         schema:
 *           type: string
 *       - name: Sunday
 *         description: Sunday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Monday
 *         description: Monday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Tuesday
 *         description: Tuesday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Wednesday
 *         description: Wednesday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Thursday
 *         description: Thursday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Friday
 *         description: Friday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *       - name: Saturday
 *         description: Saturday schedule
 *         in: formData
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule created successfully
 *       400:
 *         description: Invalid input provided
 */
//Creating Schedules
app.post('/classes/schedules', async (req, res) => {
  const { userId, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Employee, Week } = req.body;
  
  const myNewObject = new Parse.Object('Schedules');
  myNewObject.set('Employee', Employee);
  myNewObject.set('Week', Week);
  myNewObject.set('Sunday', Sunday);
  myNewObject.set('Monday', Monday);
  myNewObject.set('Tuesday', Tuesday);
  myNewObject.set('Wednesday', Wednesday);
  myNewObject.set('Thursday', Thursday);
  myNewObject.set('Friday', Friday);
  myNewObject.set('Saturday', Saturday);
  
  

  try {
    const result = await myNewObject.save();
    console.log('Schedules created', result);
    res.status(200).json({ message: 'Schedule created successfully', result });
  } catch (error) {
    console.error('Error while creating Schedules: ', error);
    res.status(400).json({ message: 'Invalid input provided' });
  }
});

/**
 * @swagger
 * /classes/schedules/{userId}:
 *  get:
 *    summary: Get user information
 *    description: Use this to look at user information
 *    parameters:
 *       - name: Employee
 *         description: Employee name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *    responses:
 *      200:
 *        description: Successful 
 *      404:
 *        description: Error -- User not found
 */
//Reading schedules
app.get('/classes/Schedules', async (req, res) => {
  const Schedules = Parse.Object.extend('Schedules');
  const query = new Parse.Query(Schedules);

  try {
    const results = await query.find(userId);
    const schedulesData = results.map(object => ({
      Employee: object.get('Employee'),
      Week: object.get('Week'),
      Sunday: object.get('Sunday'),
      Monday: object.get('Monday'),
      Tuesday: object.get('Tuesday'),
      Wednesday: object.get('Wednesday'),
      Thursday: object.get('Thursday'),
      Friday: object.get('Friday'),
      Saturday: object.get('Saturday'),
    
    }));
  
    res.json({ schedules: schedulesData }); // Sending schedules data back as JSON
  } catch (error) {
    console.error('Error while fetching Schedules', error);
    res.status(500).send('Error fetching schedules'); // Sending an error status and message back
  }
});


port = process.env.PORT || 5678;
var listener = app.listen(port);
  console.log('Server is running...');
  console.log(`Webapp:   http://localhost:${port}/login.html`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
