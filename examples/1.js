const { ui } = require("../src/CliToWeb");

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

// Show Text
ui.tell("Hi, I am node. Nice to meet you :)");

// Show Warning
ui.warn("This is how warnings should look like");

// Show Error
ui.error("This is how an errormessage might look like");