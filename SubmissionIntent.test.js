var expect = require('chai').expect;
const {handler} = require('../index');
const sinon = require('sinon');
const dynmoClient = require('../DynamoClient')


const alexaEvent = (slots, intentName) => {
    return {
    "session": {
        "sessionId": "SessionId.154291c5-a13f-4e7a-ab5a-2342534adfeba",
        "application": {
            "applicationId": "amzn1.echo-sdk-ams.app.APP_ID"
    },
    "attributes": {},
    "user": {
        "userId": null
    },
    "new": true
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.474c15c8-14d2-4a77-a4ce-154291c5",
        "timestamp": "2016-07-05T22:02:01Z",
        "intent": {
            "name": intentName,
            "slots": slots,
        },
        "locale": "en-US"
    },
    "version": "1.0"
    }
}

const invokeHandler = async (handler, event) => {
    return new Promise((resolve, reject) => {
      return handler(event, {}, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }

describe('Array', () => {
    afterEach(() => {
        sinon.restore();
    });
        it('Provide Submission as Intent with course and moudle name alexa should return the submission date as return speech', ()=> {
            const slots = {
                "courseName": "MSc computer science",
                "module": "Software development",
            }
            sinon.stub(dynmoClient, 'getByKeys').returns(Promise.resolve(
                {
                Item: {
                    "courseName": "MSc computer science",
                    "moduleName": "dissertation project",
                    "Submission": {
                        "Date": "4 October",
                        "time": "11.59 pm"
                     }
                },
              "Module_Name_Day": "advanced computer science"
            }));
            return invokeHandler(handler, alexaEvent(slots, 'SubmissionIntent')).then(resp => {
                console.log('resp', resp);
                expect(resp.response.outputSpeech.ssml).equals(
                    '<speak>Your submission is on4 October at 11.59 pm</speak>');
                });  
        });
});