
const STARTING_LINK = "https://api.coingecko.com/api/v3";
const COINS = "/coins";

let connection;
let seconds;
let ids = [
    "01coin",
    "0chain",
    "0x",
    "0xdao",
    "0xmonero"
]

$(document).ready(function () {
    testConnection();
    $("#getCoins").click(function () {
        getCoins(ids)
    }
    )
});

function getCoin(id) {
    console.log("called coins");
    $.ajax({
        url: STARTING_LINK + COINS  + "/" + id,
        type: "GET",
        success: function (data, status) {
            console.log(data);
            appendData(data);
        },
        error: function (data, status) {
            console.log("Unable to append data");
        }
    });
}

function getCoins(ids) {
    ids.forEach(element => {
        getCoin(element);
    });
}

let tableExists = false;
function appendData(data) {
    var addAfter = $("#appendAfter");

    var tr = document.createElement("tr");
    var name = document.createElement("td");
    var usdPrice = document.createElement("td");
    var timeStamp = document.createElement("td");
    name.innerHTML = data.name;
    usdPrice.innerHTML = data.market_data.current_price.usd;
    timeStamp.innerHTML = seconds + "s";
    tr.appendChild(name);
    tr.appendChild(usdPrice);
    tr.appendChild(timeStamp);
    addAfter.append(tr);
}
/**
 *  <table id="dataTable">
        <tr id="appendAfter">
            <th>Name of Crypto</th>
            <th>Price in USD</th>
            <th>Timestamp</th>
        </tr> 
    </table>
 * 
 */
function tableCreater() {

}

var interval = window.setInterval(function () {
    seconds = + 10;
    if (connection) {

    }
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
            $("#connTestPlace").html("Status : - API doesnt work !");
            console.log("error");
            console.log(data + " " + status);
        }
    });
}
