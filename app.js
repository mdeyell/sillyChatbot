var builder = require('botbuilder');
var restify = require('restify');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

var dialog = new builder.IntentDialog();



bot.dialog('/', [
    function (session) {
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response;
        session.send('Hello %(name)s! I love %(company)s!', session.userData.profile);
        session.beginDialog('/working');
    }
]);

bot.dialog('/joke/', [
    function (session) {
      session.send('Q. What happens if you eat yeast and shoe polish?');
      session.send('A. Every morning you\'ll rise and shine!');
    }
]);

bot.dialog('/working', [
    function (session) {
    	    builder.Prompts.text(session, "How long have you been working there?");
    	    console.log(5 + 6);
console.log(session);

    },
    function (session,results,next) {
    	     var time =results.response;
             session.send(""+time+' is a long time for you to work at %(company)s',session.userData.profile);
             builder.Prompts.text(session, "Tell me a funny story that happened at work");
    },
     function (session,results,next) {
    	     var time =results.response;
    	     session.send("hahahahahaha (I hope what you said is actually funny....)");
    	     session.send("I also wish I was a real human...");
    	     next();
           // builder.Prompts.text(session, "By the way are you a programmer?");
    },
      function (session,results,next) {
    	     var programmer =results.response;
var h = new Object(); // or just {}
h['yes'] = 'yes';
h['no'] = 'no';
             builder.Prompts.choice(session, 'By the way are you a programmer?', h);
    	     //session.send("Hello test");
    },
      function (session,results,next) {
    	     var programmer =results.response;
    	     console.log(programmer);
    	     if(programmer.entity=="yes"){
    	     	session.send("That's Great!!");
    	     }else
    	     {
    	     	session.send("Oh :/");
    	     }
    	     //session.send("Hello test");
    }
]);


bot.dialog('/ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.company) {
            builder.Prompts.text(session, "What company do you work for?");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

/*
// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

bot.dialog('Good', function (session, args, next) {
    session.send('This is a good answer');
    session.send(questions[questionsArray[0]]);
    session.send(questionsArray[1]);
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Good'
});

bot.dialog('Bad', function(session, args, next) {
    session.send('This is a bad answer');
    session.send(questions[questionsArray[0]]);
    session.send(questionsArray[1]);
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Bad'
});  
*/


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/', connector.listen());
