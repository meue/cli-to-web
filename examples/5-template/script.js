function randomize() {
    // some magic
    const input1 = document.getElementById("valuesFromIframe1");
    const input2 = document.getElementById("valuesFromIframe2");
    const input3 = document.getElementById("valuesFromIframe3");

    input1.value = Math.floor(Math.random() * 100000);
    input2.value = Math.floor(Math.random() * 100000);
    input3.value = Math.floor(Math.random() * 100000);

    const someBackgroundColor = Math.floor(Math.random() * 16777215).toString(16);
    const body = document.getElementsByTagName("body")[0];
    body.style.backgroundColor = "#" + someBackgroundColor;
}

setInterval(randomize, 500);

function receiveNodeData(data) {
    console.log("some custom data, send from nodejs:");
    console.log(data);
}