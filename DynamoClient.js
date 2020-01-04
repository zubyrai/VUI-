const DynamoDB = require('aws-sdk/clients/dynamodb')
const dynamoClient  = require('aws-sdk/clients/dynamodb')
const getDynamoClient = () => {
    const AWS = require('aws-sdk');
    return new AWS.DynamoDB.DocumentClient({
        service: new DynamoDB({
            endpoint: process.env.DOC_DYNAMO_ENDPOINT,
            region: 'eu-west-1'
        }),
    });

};
const getByKeys = (tableName, keyObject) => {
    const queryParameters = {
        TableName: tableName,
        Key: keyObject,
        ConsistentRead: true,
    };
return new Promise((resolve, reject) => {
    getDynamoClient().get(queryParameters, (err, data) => {
    err ? reject(err) : resolve(data);
    });
});
};

const getByKey = (value, columnName, tableName) => {
    const queryParameters = {
        TableName: tableName,
        ExpressionAttributeValues: {
            ':c' : value
        },
        KeyConditionExpression: `${columnName} = :c`,
        ConsistentRead: true,
    };
return new Promise((resolve, reject) => {
    getDynamoClient().query(queryParameters, (err, data) => {
    err ? reject(err) : resolve(data);
    });
});
};

const put = (tableName, reminderObject) => {
    console.log('Put called');
    const params = {
        TableName: tableName,
        Item: reminderObject,
    };
    return new Promise((resolve, reject) => {
        getDynamoClient().put(params, (err, data) => {
        err ? reject(err) : resolve(data);
        });
    });

};
module.exports = {put, getByKeys, getByKey}