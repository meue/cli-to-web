window.addEventListener("apiLoaded", doStuff);


function doStuff() {
    console.log("api loaded");
    const params = api.getNodeParams();

    const input1 = document.getElementById("valuesFromIframe1");
    const input2 = document.getElementById("valuesFromIframe2");

    input1.value = params.value; // value is defined in your node script
    input2.value = params.value2; // value2 is defined in your node script
}