
const STARTING_LINK = "https://api.coingecko.com/api/v3";
let connection;
let seconds;

$(document).ready(function () {
    testConnection();
});

function getCoin(id) {
    $.ajax({
        url: STARTING_LINK + "/ping",
        data: id,
        type: "GET",
        success: function (data, status) {
            appendData(data);
        },
        error: function (data, status) {
            console.log("Unable to append data");
        }
    });
}

let tableExists = false;
function appendData(data) {
    var addAfter = $("#appendAfter");
    var markup = "<tr>" + "<td>" + data.name + "</td>" + "<td>" + data.market_data.current_price.usd + "</td>" + "<td>"+ seconds + "</td>"+
    "</tr>";
    addAfter.append(markup);
}

var interval = window.setInterval(function () {
    seconds =+ 10;
    
});


function testConnection() {
    $.ajax({
        url: STARTING_LINK + "/ping",
        type: "GET",
        success: function (data, status) {
            $("#connTestPlace").html("Status : " + data.gecko_says + " - API works !");
            console.log(data);
            connection = true;
        },
        error: function (data, status) {
            $("#connTestPlace").html("Status : API doesnt work !");
            console.log("error");
            console.log(data + " " + status);
        }
    });
}
