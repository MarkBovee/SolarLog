// Domoticz server settings
var domoticz = { 
    server: "84.84.4.7",
    port: "443",
    auth: "c29sYXI6Qlc2S0ZBTjhjdmZidmFVNQ==",
    devices: {
        // The idx of smart meter devices
        solar: 6,
        gas: 8,
        weather: 13
    }
};

// Color settings for graphs and charts
var colors = {
    usage : {
        primary: rgb(181, 196, 255),
        secondary: rgb(230, 230, 247)
    },
    return : {
        primary: rgb(154, 237, 190),
        secondary: rgb(230, 247, 230)
    },
    gas : {
        primary: rgb(244, 137, 66),
        secondary: rgb(244, 216, 198)
    }
};
