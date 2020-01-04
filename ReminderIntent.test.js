// var expect = require('chai').expect;
// const {
//     handler
//   } = require('../index')
  

// const alexaEvent = (slots) => {
//     return {
//     "session": {
//         "sessionId": "SessionId.154291c5-a13f-4e7a-ab5a-2342534adfeba",
//         "application": {
//             "applicationId": "amzn1.echo-sdk-ams.app.APP_ID"
//     },
//     "attributes": {},
//     "user": {
//         "userId": null
//     },
//     "new": true
//     },
//     "request": {
//         "type": "IntentRequest",
//         "requestId": "EdwRequestId.474c15c8-14d2-4a77-a4ce-154291c5",
//         "timestamp": "2016-07-05T22:02:01Z",
//         "intent": {
//             "name": "ReminderIntent",
//             "slots": slots,
//         },
//         "locale": "en-US"
//     },
//     "version": "1.0"
//     }
// }

// const invokeHandler = async (handler, event) => {
//     return new Promise((resolve, reject) => {
//       return handler(event, {}, (err, result) => {
//         if (err) return reject(err)
//         return resolve(result)
//       })
//     })
//   }

// describe('Array', () => {
//       //  this.timeout(30000);
        
//         it.only('Provide leture as Intent it should return the lecture speech', ()=> {
//             const slots = { 
                
//                 "name": "Lecture Reminder",
//                 "date": "23-Sep-2019",
//                 "time": "2",
//             }
//             return invokeHandler(handler, alexaEvent(slots)).then(resp => {
//                 expect(resp.response.outputSpeech.ssml).equals(
//                     '<speak>Your lecture starts at 6pm-9pm in college building room no. CG06</speak>');
//                 });  
//         });

//         it('when user provided intent as find my next lecture, then it should return next available lecture', ()=> {
//             const slots = { 
                
//             }
//             return invokeHandler(handler, alexaEvent(slots)).then(resp => {
//                 expect(resp.response.outputSpeech.ssml).equals(
//                     '<speak>Your next lecture starts at 6pm-9pm in college building room no. CG06</speak>');
//                 });  
//         });
          
// });