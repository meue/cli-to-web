# Cli-to-web - The Web-interface for your Node-CLI
Bring your cli to the next level by pushing your terminal prompts to the web.

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

Show a simple message
```javascript
ui.tell("Hey, you rock!");
```

Error message
```javascript
const errormessage = ...
ui.tell("something failed. here is your stacktrace: " + errormessage);
```

Ask a html-page
```javascript
const answer = await ui.ask("Enter some value please: <input id='idOnHTML-page'>");
const someValue = answers.getValue("idOnHTML-page");
```

Ask with predefined templates
```javascript
const question = new ui.Question();
question.addString("projectName", "Whats the name of your product?", 20);
question.addNumber("someNumber", "please enter some number", 3);
question.addChoice("someChoice", "please choose", ["answer1", "answer2", "answer3"]);
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

Create your 100% custom Prompts using templates.
For more information about templating, please find the attached example 5.js
```javascript
const ui = require("../src/CliToWeb");
const templateId = "myForm";
const templatePath = __dirname + "/myTemplate";
ui.registerTemplate(templateId, templatePath);

async function askTemplate() {
    const myCustomQuestion = new ui.Template(templateId, 100);
    const answer = await ui.ask(myCustomQuestion);
    console.log("Your values:");
    console.log(answer.getValue("valuesFromIframe1"));
    console.log(answer.getValue("valuesFromIframe2"));
    console.log(answer.getValue("valuesFromIframe3"));
}
```

# Examples
Please discover the examples under examples/\
Run them:
```
node ./node_modules/cli-to-web/examples/1.js
```