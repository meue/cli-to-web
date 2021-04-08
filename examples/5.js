const ui = require("../src/CliToWeb");
const templateId = "myForm";
const templatePath = __dirname + "/5-template";

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

const myCustomQuestion = ui.registerTemplate(templateId, templatePath);
askTemplate();

async function askTemplate() {
    const someValuesToPass = { value: "foo", value2: "bar" };
    const answer = await ui.ask(myCustomQuestion, someValuesToPass);
    console.log("Your values:");
    console.log(answer.getValue("valuesFromIframe1"));
    console.log(answer.getValue("valuesFromIframe2"));
    ui.tell("Thank you");
}