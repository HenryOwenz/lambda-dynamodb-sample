const dynamoose = require("dynamoose");

// DynamoDB Configuration
const REGION = process.env.AWS_REGION;
dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({
  region: REGION
}));

// Define DynamoDB Model
const UserSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true
  },
  name: String
}, {
  saveUnknown: true,
  timestamps: true
});

const dynamoUser = dynamoose.model("dynamodb-table", UserSchema, { create: false });
module.exports = { dynamoUser };