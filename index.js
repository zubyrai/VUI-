'use strict';
const dynmoClient = require('./DynamoClient');
var moment = require('moment');
const Alexa = require('ask-sdk-core');
const appName = 'helper';

const getDayOfWeek  = (weekDay) => {
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'];
return days[ weekDay-1];
}
  
const LaunchRequestHandler = {
    canHandle(handlerInput) {
       return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        //welcome message
        let speechText = 'Welcome to MDX helper, how can I help you';
        //welcome screen message
        let displayText = "Welcome to Middlesex campus";

       
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, displayText)
            .getResponse();
    }
};

const LectureIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.intent.name === 'LectureIntent';
  },
  handle(handlerInput){
  let speechText   = 'Your lecture ';
  let intent = handlerInput.requestEnvelope.request.intent;
  let courseName = intent.slots.courseName;
  let moduleName = intent.slots.module;


  if (!courseName) {
      const slotToElicit = 'courseName';
      const speechOutput = 'Please tell me your course name?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput);  
  
   }
  if (!moduleName) {
      const slotToElicit = 'module';
      const speechOutput = 'Please tell me the module?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput);  
   }   
  
   
   const queryObject = {
      Course_Name: courseName.value,
      Module_Name_Day: moduleName.value,
      };
      return dynmoClient.getByKeys('LectureIntent', queryObject).then(respone  => {
          
          speechText = speechText + 'time is ' + respone.Item.Lecture_Time.time + ' hours' + ' at location ' + respone.Item.Lecture_Time.Location
          return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(appName)
          .withShouldEndSession(true)
          .getResponse();
      }).catch(error => {
        speechText = 'Sorry, No lecture for' + response.moduleName +  'Would you like to ask lecture for another module';
        console.log(' ', error);
      }) 
      
  
      }
  
      
  };

  const NextLectureIntentHandler = {
    canHandle(handlerInput) {
      
        return handlerInput.requestEnvelope.request.intent.name === 'NextLectureIntent';
    },
    handle(handlerInput){
    let speechText   = 'Your lecture ';
    let intent = handlerInput.requestEnvelope.request.intent;
    let courseName = intent.slots.courseName;
    
    
    if (!courseName) {
        const slotToElicit = 'CourseName';
        const speechOutput = 'Please tell me your course name?';
        return this.emit(':elicitSlot', slotToElicit, speechOutput);  
    
     }
     
    
     const queryObject = {
        Course_Name: courseName.value,
        };
    
        console.log('queryObject', queryObject);
        return dynmoClient.getByKey(courseName.value, 'Course_Name', 'LectureIntent').then(respone  => {
            const date  = new Date();
            const currentTime = `${date.getHours()}.${date.getMinutes()}`
            const slectedLecture = respone.Items.filter(item => 
                item.Lecture_Time.Day === getDayOfWeek(moment().day()) && currentTime < item.Lecture_Time.time);
            const filteredLecture = slectedLecture[0];
            if(filteredLecture) {
            speechText = speechText + 'time is ' + filteredLecture.Lecture_Time.time  + 'in ' + filteredLecture.Lecture_Time.Location
            } else {
                speechText = 'Sorry, No lecture .  Would you like to ask lecture for another day';
            }
            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName)
            .withShouldEndSession(true)
            .getResponse();
        }).catch(error => {
            
            speechText = 'Sorry, No lecture .  Would you like to ask lecture for another day';
            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName)
            .withShouldEndSession(true)
            .getResponse();
        }) 
        
    
        }
    
        
    };

    const SubmissionIntentHandler = {
      canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.intent.name === 'SubmissionIntent';
      },
      handle(handlerInput){
      let speechText   = 'Your submission ';
      let intent = handlerInput.requestEnvelope.request.intent;
      let courseName = intent.slots.courseName;
      let moduleName = intent.slots.module;
      
      
      if (!courseName) {
          const slotToElicit = 'courseName';
          const speechOutput = 'Please tell me your course name?';
          return this.emit(':elicitSlot', slotToElicit, speechOutput);  
      
       }
      if (!moduleName) {
          const slotToElicit = 'module';
          const speechOutput = 'Please tell me the module?';
          return this.emit(':elicitSlot', slotToElicit, speechOutput);  
       }   
       
       const queryObject = {
          courseName: courseName.value,
          moduleName: moduleName.value,
          };
          return dynmoClient.getByKeys('SubmissionIntent', queryObject).then(respone  => {
              speechText = speechText + 'is on' + respone.Item.Submission.Date  + ' at ' + respone.Item.Submission.time
              return handlerInput.responseBuilder
              .speak(speechText)
              .withSimpleCard(appName)
              .withShouldEndSession(true)
              .getResponse();

              
          }).catch(error => {
             speechText = 'Sorry, No submission for' + respone.moduleName +  'Would you like to ask lecture for another module';
              return handlerInput.responseBuilder
              .speak(speechText)
              .withSimpleCard(appName)
              .withShouldEndSession(true)
              .getResponse();

          }) 
          
      
          }
      
          
      };
    


const ReminderIntentHandler = {
      canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.intent.name === 'ReminderIntent';
      },
     async handle(handlerInput){

        const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
       
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        const {permissions} = handlerInput.requestEnvelope.context.System.user


        if (!permissions){
             return handlerInput.responseBuilder
             .speak("please go to the Alexa mobile app to grant permissions")
             .withAskForPermissionsConsentCard(['alexa::alerts:reminder:skill:readwrite'])
             .getResponse();
           }
        let speechText   = 'Your reminder has been set';
        let intent = handlerInput.requestEnvelope.request.intent;
        let name = intent.slots.name.value;
        let time = intent.slots.time.value;
        let date = intent.slots.date.value;
        
       if (!name) {
          const slotToElicit = 'ReminderName';
          const speechOutput = 'What is the reminder?';
          return this.emit(':elicitSlot', slotToElicit, speechOutput);  

       }
      if (!time) {
          const slotToElicit = 'ReminderTime';
          const speechOutput = 'What time?';
          return this.emit(':elicitSlot', slotToElicit, speechOutput);  
       }   
       if (!date) {
        const slotToElicit = 'ReminderDate';
        const speechOutput = 'What date?';
        return this.emit(':elicitSlot', slotToElicit, speechOutput);  

     }

   const dateTime = `${date.value} ${time.value}`;
   

   const reminderTime =  moment(dateTime).format('YYYY-MM-DDThh:mm:ss');
   

   const reminderSetTime =  moment(new Date()).format('YYYY-MM-DDThh:mm:ss');
   

   const reminderObject = {
    "requestTime" : reminderSetTime,
    "trigger": {
         "type" : "SCHEDULED_ABSOLUTE",
         "scheduledTime" : reminderTime,
         "timeZoneId" : "Europe/London",
         "recurrence" : {                     
             "freq" : "WEEKLY",               
             "byDay":  [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ]                
         }
    },
    "alertInfo": {
         "spokenInfo": {
             "content": [{
                 "locale": "en-US", 
                 "text": name.value
             }]
         }
     },
     "pushNotification" : {                            
          "status" : "ENABLED"
     }
 }
const respone = null;
try {
  respone = await client.createReminder(reminderObject);
} catch(error) {
   
  speechText   = 'Could not able to set reminder';
  return handlerInput.responseBuilder
  .speak(speechText)
  .withSimpleCard(appName)
  .withShouldEndSession(true)
  .getResponse();}

return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(appName)
      .withShouldEndSession(true)
      .getResponse();
 
  }
};

const EventIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.intent.name === 'EventIntent';
    },
    handle(handlerInput){
    let speechText   = 'There is a event called ';
    let intent = handlerInput.requestEnvelope.request.intent;
    let day = intent.slots.day;
    
    
    
    if (!day) {
        const slotToElicit = 'day';
        const speechOutput = 'Please tell me the day?';
        return this.emit(':elicitSlot', slotToElicit, speechOutput);  
    
     }
     
     const queryObject = {
        Day: day.value,
    
        };
        return dynmoClient.getByKeys('EventIntent', queryObject).then(respone  => {
            speechText = speechText + respone.Item.Event.Name  + ' at ' + respone.Item.Event.Time + ' in ' + respone.Item.Event.Location
            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName)
            .withShouldEndSession(true)
            .getResponse();

            
        }).catch(error => {
           speechText = 'Sorry, No event for' + respone.Day +  'Would you like to ask event for another day';
            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName)
            .withShouldEndSession(true)
            .getResponse();

        }) 
        
    
        }
    
        
    };

    const ProfDetailIntentHandler = {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.intent.name === 'ProfDetailIntent';
        },
        handle(handlerInput){
        let speechText   = 'Email address of ';
        let intent = handlerInput.requestEnvelope.request.intent;
        let name = intent.slots.name.value;
        
        
        
        if (!name) {
            const slotToElicit = 'name';
            const speechOutput = 'Please tell me name of the professor?';
            return this.emit(':elicitSlot', slotToElicit, speechOutput);  
        
         }
         
         const queryObject = {
            ProfName: name,
        
            };
            return dynmoClient.getByKeys('ProfIntent', queryObject).then(respone  => {
                speechText = speechText + respone.ProfName  + ' is ' + respone.Item.ProfDetail.Email
                return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard(appName)
                .withShouldEndSession(true)
                .getResponse();
    
                
            }).catch(error => {
               speechText = 'Sorry, No email information is available for Professor' + respone.ProfName +  'Would you like to ask email of another professor';
                return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard(appName)
                .withShouldEndSession(true)
                .getResponse();
    
            }) 
            
        
            }
        

            
            
        };

        const BookIntentHandler = {
            canHandle(handlerInput) {
                return handlerInput.requestEnvelope.request.intent.name === 'BookIntent';
            },
            handle(handlerInput){
            let speechText   = 'this book named ';
            let intent = handlerInput.requestEnvelope.request.intent;
            let name = intent.slots.name.value;
            
            
            
            if (!name) {
                const slotToElicit = 'name';
                const speechOutput = 'Please tell me name of the book?';
                return this.emit(':elicitSlot', slotToElicit, speechOutput);  
            
             }
             
             const queryObject = {
                Name: name,
            
                };
                return dynmoClient.getByKeys('BookIntent', queryObject).then(respone  => {
                    speechText = speechText + respone.Name  + ' is  available at ' + respone.Item.Book_Location.Location
                    return handlerInput.responseBuilder
                    .speak(speechText)
                    .withSimpleCard(appName)
                    .withShouldEndSession(true)
                    .getResponse();
        
                    
                }).catch(error => {
                   speechText = 'Sorry, this book is not available in library';
                    return handlerInput.responseBuilder
                    .speak(speechText)
                    .withSimpleCard(appName)
                    .withShouldEndSession(true)
                    .getResponse();
        
                }) 
                
            
                }
            
    
                
                
            };
        
    
    


  /**
   * Lists all saved reminder for the current user.
  
   */

  //end Custom handlers

const HelpIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      //help text for your skill
      let speechText = 'You can ask about any queries realting to middlesex university campus';

      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard(appName, speechText)
          .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
              || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      let speechText = 'Goodbye';
      return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(appName, speechText)
          .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
      //any cleanup logic goes here
      return handlerInput.responseBuilder.getResponse();
  }
};


exports.handler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         LectureIntentHandler,
                         NextLectureIntentHandler,
                         SubmissionIntentHandler,
                         ReminderIntentHandler, 
                         EventIntentHandler,
                         ProfDetailIntentHandler,
                         BookIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         SessionEndedRequestHandler)
                         //.withApiClient(new Alexa.DefaultApiClient())
                          .lambda();
