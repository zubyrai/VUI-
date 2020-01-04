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
        it('Provide leture as Intent it should return the lecture speech', ()=> {
            const slots = {
                "courseName": "MSc computer science",
                "module": "Software development",
            }
            sinon.stub(dynmoClient, 'getByKeys').returns(Promise.resolve(
                {
                Item: {
                  "Course_Name": "MSc computer science",
                  "Lecture_Time": {
                  "Day": "Tuesday",
                  "Location": "Hatchcroft H106",
                  "time": "11"
              }
            },
              "Module_Name_Day": "advanced computer science"
            }));
            return invokeHandler(handler, alexaEvent(slots, 'LectureIntent')).then(resp => {
                console.log('resp', resp);
                expect(resp.response.outputSpeech.ssml).equals(
                    '<speak>Your lecture time is 11 hours at location Hatchcroft H106</speak>');
                });  
        });

        it('when user provided intent as find my next lecture, then it should return next available lecture', ()=> {
            const slots = {
                "courseName": "MSc computer science",
            }
            sinon.stub(dynmoClient, 'getByKey').returns(Promise.resolve(
                {
                Item: {
                  "Course_Name": "MSc computer science",
                  "Lecture_Time": {
                  "Day": "Tuesday",
                  "Location": "Hatchcroft H106",
                  "time": "11"
              }
            },
              "Module_Name_Day": "advanced computer science"
            }));
            return invokeHandler(handler, alexaEvent(slots, 'NextLectureIntent')).then(resp => {
                expect(resp.response.outputSpeech.ssml).equals(
                    '<speak>Sorry, No lecture .  Would you like to ask lecture for another day</speak>');
                });  
            });            
});