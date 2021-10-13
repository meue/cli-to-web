# Cli-to-web - The Web-interface for your Node-CLI
Bring your cli to the next level by pushing your terminal prompts to the web.\
If you like it, I would be super-happy if you star me on <a href="https://github.com/meue/cli-to-web">github</a> :)

# usecases
- You want to create a <span style="color: red">wizard</span> doing things for you. 
- You want to <span style="color: red">keep track of stuff</span> on your node sripts running locally
- You want to use your CLI <span style="color: red">remotely</span>
- You want to collaborate on your CLI with <span style="color: red">multiple co-workers</span>
- You want to continue using your CLI tomorrow. Simply <span style="color: red">close and reopen</span> it.
- You want to have some <span style="color: red">super complex user interface</span> which your current CLI ist simply not capable of
- You want to prompt multiple things at the same time and you dont care <span style="color: red">the order the user responds</span> to it. (have fun with some async-await-promise-magic)

# what it actually does
cli-to-web creates an interface between your node-cli and you over websockets.
It can ask you things like "please enter a password i need to continue processing",
notify and update you how far the process is like "i am 95% done",
send error- and normal messages like "I'm done compressing all your moviefiles".

# installation
simple as it should be:
```
npm install cli-to-web
```

# usage
Instantiate it on every node.js-file you need it. It is a singleton and you dont need to pass the instance of cli-to-web
```javascript
const ui = require("cli-to-web");
ui.tell("Hello web interface");
```

# api

Open the browser\
You dont need to open the browser this way. You can also open it manually at any point in time. <span style="color: red">You can close your browser and reopen it later. </span>All submitted progress is stored.
```javascript
ui.show();
```

Close Webserver
```javascript
ui.finish();
```

Show a simple message
```javascript
ui.tell("Hey, you rock!");
```

Warning message
```javascript
ui.warn("something is weird but still running.");
```

Error message
```javascript
const errormessage = ...
ui.error("something failed. here is your stacktrace: " + errormessage);
```

Ask a html-page. For more complex pages including js and css, please see Templates
```javascript
const answer = await ui.ask("Enter some value please: <input id='idOnHTML-page'>");
const someValue = answer.getValue("idOnHTML-page");
```

Ask with predefined templates
```javascript
const question = new ui.Question();
question.addString("projectName", "Whats the name of your product?", 20);
question.addNumber("someNumber", "please enter some number", 3);
question.addChoice("someChoice", "please choose", ["answer1", "answer2", "answer3"]);
question.addMultipleChoice("multipleChoice", "please choose multiple", ["answer1", "answer2", "answer3"]);
question.addColor("someColor", "Tell me a color");
question.addDate("someDate", "Tell me a date");
question.addTime("someTime", "Whats your current time?");
question.addRange("someValue", "I like rangesliders", 1, 100);
question.addCheckbox("someBool", "please check", false);
const answer = await ui.ask(question);
// read result
const projectName = answer.getValue("projectName");
```

Show and update progress
```javascript
const progressId = ui.showProgress("Doing some calculations ... please wait");
// do something time intensive
ui.updateProgress(progressId, 25);
// do something time intensive
ui.updateProgress(progressId, 50);
// do something time intensive
ui.updateProgress(progressId, 75);
// do something time intensive
ui.updateProgress(progressId, 100, "Im done!");
```

Show no progress, just keep and update the text
```javascript
const progressId = ui.showProgress();
ui.updateProgress(progressId, -1, "Doing something");
ui.updateProgress(progressId, -1, "... and now something else");
ui.updateProgress(progressId, -1, "... surprise!");
```

Show indetermined progress (moving stripes, filled progressbar)
```javascript
const progressId = ui.showProgress();
ui.updateProgress(progressId, -2, "dont know how long this might take");
```

# templates
Create your 100% custom Prompts and Editors using templates.
For more information about templating, please find the attached example 5.js
```javascript
const templateId = "myForm";
const templatePath = __dirname + "/myTemplate";
const myCustomQuestion = ui.registerTemplate(templateId, templatePath);

async function askTemplate() {
    const answer = await ui.ask(myCustomQuestion);
    console.log("Your values:");
    console.log(answer.getValue("valuesFromIframe1"));
    console.log(answer.getValue("valuesFromIframe2"));
    console.log(answer.getValue("valuesFromIframe3"));
}
```

Sending data to template works by passing an object to ui.ask:
```javascript
const myData = {somethingINeed: "foo", moreInformation: "bar"};
const answer = await ui.ask(myCustomQuestion, myData);
```

You will also need a function in your template to receive the data.
```javascript

// api will be injected as soon as "apiLoaded" was triggered
window.addEventListener("apiLoaded", ready);
function ready() {
    // receive parameters from node
    const parameters = api.getNodeParams();
    console.log(parameters.somethingINeed);
    console.log(parameters.moreInformation);

    // rescale your iframe (will be done initially)
    api.rescale();

    // get iframe instance.. just in case you need it
    const iframe = api.getIframe();
}
```

You can also specify a URL for your template to call your external helper-tools.\
Simply use an URL for the templatePath.\
But take care: You need to take care for the cross-origin problem yourself. Maybe with a crossdomain.xml file
```javascript
const templateId = "myForm";
const templatePath = "0.0.0.0:80/myCoolForm";
const myCustomQuestion = ui.registerTemplate(templateId, templatePath);
```

# change port
defaultport is 3000, but can be changed to anything you like.

Bash:
```
PORT=3001 node ./myNodeApp.js
```
Windows Powershell:
```
$env:PORT=3001
node ./myNodeApp.js
```
Windows CMD:
```
SET PORT=3001
node ./myNodeApp.js
```

# Examples
Please discover the examples under examples/\
Run them:
```
node ./node_modules/cli-to-web/examples/1.js // simple messages
node ./node_modules/cli-to-web/examples/2.js // show progress
node ./node_modules/cli-to-web/examples/3.js // asking html-content
node ./node_modules/cli-to-web/examples/4.js // asking predefined questions
node ./node_modules/cli-to-web/examples/5.js // using templates
node ./node_modules/cli-to-web/examples/6.js // replace your remote-ssh-commands with buttons
```