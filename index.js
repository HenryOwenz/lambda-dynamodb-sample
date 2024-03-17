// Import required dependency packages
const serverless = require('@vendia/serverless-express');
const express = require('express');
const { DynamoUser } = require('./dynamodb'); // dynamodb database
const { names } = require('./constants');

// Serverless Express setup
const app = express();
const lambdaHandler = serverless({ app });

// API Endpoints
app.get('/', (_, res) => {
  res.send('Welcome to the Lambda Serverless Express app with DynamoDB. In this sample code, you can create and list users.');
});

// Endpoint to create a user
app.get('/create', async (_, res) => {
  try {
    const randomName = getRandomName();
    const uniqueId = generateUniqueId(randomName);

    const user = await DynamoUser.create({ id: uniqueId, name: randomName });
    res.send(`User created: ${JSON.stringify(user)}`);
  } catch (error) {
    res.status(500).send(`Failed to create user: ${error}`);
  }
});

// Endpoint to list a random number of users between 0 and 50
app.get('/list', async (_, res) => {
  try {
    const randomLimit = getRandomLimit();
    const users = await DynamoUser.list({ limit: randomLimit });

    console.log(`Fetched ${users.length} users`);
    res.send(`${JSON.stringify(users)} Fetched ${users.length} users`);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).send(`Failed to fetch users: ${error}`);
  }
});

// Helper functions
function getRandomName() {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

function generateUniqueId(name) {
  return `${name.slice(0, 2)}-${Date.now()}`;
}

function getRandomLimit() {
  return Math.floor(Math.random() * 50);
}

// AWS Lambda Handler
module.exports.handler = async (event, context) => {
  return lambdaHandler(event, context);
};

// Local server for development
// if (process.env.NODE_ENV !== 'AWS') {
//   const port = 3001;
//   app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}/`);
//   });
// }