# Cli-to-web - The Web-interface for your Node-CLI
Bring your cli to the next level by pushing your terminal prompts to the web.

# usecases
- During development you are running scripts to automate parts of your work. From time to time your script needs input from you.\
- You want to create a wizard doing things for you. \
- You want to keep track of stuff on your node sripts running locally \
- You want to use your CLI remotely or with other people
- You want to continue using your CLI tomorrow

# what it actually does
cli-to-web creates an interface between your node-cli and you over websockets.\
It can ask you things like "please enter a password i need to continue processing",\
notify and update you how far the process is like "i am 95% done",\
send error- and normal messages like "I'm done compressing all your moviefiles".\

# installation
simple as it should be:\
npm install cli-to-web\

# usage
const ui = require("cli-to-web");\
ui.tell("Hello web interface");


# api

// simple message\
ui.tell("Hey, you rock!");

// error message\
const errormessage = ...\
ui.tell("something failed. here is your stacktrace: " + errormessage);\

// ask a html-page\
const answer = await ui.ask("Enter some value please: <input id='idOnHTML-page'>");\
const someValue = answers.getValue("idOnHTML-page");\

// ask with predefined templates\
const question = new ui.Question();\
question.addString("projectName", "Whats the name of your product?", 20);\
question.addNumber("someNumber", "please enter some number", 3);\
question.addChoice("someChoice", "please choose", ["answer1", "answer2", "answer3"]);\
const answer = await ui.ask(question);\
// read result\
const projectName = answer.getValue("projectName");\

// show and update progress\
const progressId = ui.showProgress("Doing some calculations ... please wait");\
// do something
ui.updateProgress(progressId, 25);\
// do something
ui.updateProgress(progressId, 50);\
// do something
ui.updateProgress(progressId, 75);\
// do something
ui.updateProgress(progressId, 100, "Im done!");\