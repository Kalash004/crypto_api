
const STARTING_LINK = "https://api.coingecko.com/api/v3";
const COINS = "/coins";
const PING = "/ping"

let data_collection_started = false;
let whenLastClickedActualization = null;
let connection;
let startSeconds;
let seconds;
const WAIT_SECONDS_MANUAL_RESTART = 5;

let ids = [
    "01coin",
    "0chain",
    "0x",
    "0xdao",
    "0xmonero",
    "bitcoin"
]

$(document).ready(function () {
    testConnection();
    createTable();

    $("#getCoins").click(function () {
        if (!connection) { alertApiNotWorking(); return; }
        if (whenLastClickedActualization != null) {
            const millis = Date.now() - whenLastClickedActualization;
            if (Math.floor(millis / 1000) < WAIT_SECONDS_MANUAL_RESTART) {
                alert(`Please wait ${WAIT_SECONDS_MANUAL_RESTART} seconds before refreshing`);
                return;
            }
        }
        whenLastClickedActualization = Date.now();
        startSeconds = Date.now();
        seconds = 0;
        data_collection_started = true;
        getCoins(ids)
    }
    )
});

function getCoin(id) {
    console.log("called coins");
    let data_storage;
     $.ajax({
        url: STARTING_LINK + COINS + "/" + id,
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

// function updateCoin(id) {
//     $.ajax({
//         url: STARTING_LINK + COINS + "/" + id,
//         type: "GET",
//         success: function (data, status) {
//             console.log(data);

//         },
//         error: function (data, status) {
//             console.log("Unable to append data");
//         }
//     });
// }

function getCoins(ids) {
    resetTable();
    ids.forEach(element => {
        getCoin(element);
    });
    
    var tbody = document.createElement("tbody");
    $("#dataTable").append(tbody);
    // sortTable();
}

let tableExists = false;
function appendData(data) {
    var tr = document.createElement("tr");
    var empty = document.createElement("th");
    var name = document.createElement("td");
    var usdPrice = document.createElement("td");
    var timeStamp = document.createElement("td");
    empty.innerHTML = "";
    name.innerHTML = data.name;
    usdPrice.innerHTML = data.market_data.current_price.usd;
    timeStamp.innerHTML = seconds + "s";
    empty.setAttribute("scope", "row");
    tr.appendChild(empty);
    tr.appendChild(name);
    tr.appendChild(usdPrice);
    tr.appendChild(timeStamp);
    $("#table-body").append(tr);
}

function createTable() {
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    var empty = document.createElement("th");
    var nameTh = document.createElement("th");
    var priceUsdTh = document.createElement("th");
    var timestampTh = document.createElement("th");
    table.setAttribute("class", "table table-success table-striped")
    table.setAttribute("id", "dataTable");
    nameTh.innerHTML = "Name of Crypto";
    priceUsdTh.innerHTML = "Price in USD";
    timestampTh.innerHTML = "Timestamp";
    empty.setAttribute("scope", "col");
    nameTh.setAttribute("scope", "col");
    priceUsdTh.setAttribute("scope", "col");
    timestampTh.setAttribute("scope", "col");
    tbody.setAttribute("id","table-body");
    tr.appendChild(empty)
    tr.appendChild(nameTh);
    tr.appendChild(priceUsdTh);
    tr.appendChild(timestampTh);
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    document.body.appendChild(table);
}

function removeTable() {
    $("#dataTable").remove();
}

function resetTable() {
    removeTable();
    createTable();
}

function updateTime() {
    var table, rows, i, x;
    table = document.getElementById("dataTable");
    rows = table.rows;
    for (i = 1; i < (rows.length); i++) {
        x = rows[i].getElementsByTagName("TD")[2];
        x.innerHTML = seconds + "s";
    }
}

function updateTable() {
    resetTable();
    getCoins(ids);
    // sortTable();
    startSeconds = Date.now();
}

var update_interval = window.setInterval(function () {
    if (!connection) {
        return;
    }
    if (!data_collection_started) {
        return;
    }
    startSeconds = Date.now();
    seconds = 0;
    updateTable();
}, 10000);

var test_interval = window.setInterval(function () {
    testConnection();
}, 60000)

var counter_interval = window.setInterval(function () {
    console.log("test");
    seconds = seconds + 1;
    updateTime();
}, 1000);

function testConnectionBtn() {
    $.ajax({
        url: STARTING_LINK + PING,
        type: "GET",
        success: function (data, status) {
            alert("API works !")
            console.log(data);
            connection = true;
        },
        error: function (data, status) {
            connection = false;
            alertApiNotWorking();
            $("#connTestPlace").html("Status : - API doesnt work !");
            console.log("error");
            console.log(data + " " + status);
        }
    });
} 

function testConnection() {
    $.ajax({
        url: STARTING_LINK + PING,
        type: "GET",
        success: function (data, status) {
            $("#connTestPlace").html("Status : " + data.gecko_says + " API works !");
            console.log(data);
            connection = true;
        },
        error: function (data, status) {
            connection = false;
            alertApiNotWorking();
            $("#connTestPlace").html("Status : - API doesnt work !");
            console.log("error");
            console.log(data + " " + status);
        }
    });
}


// not working rn
// function sortTable() {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("dataTable");
//     switching = true;
//     while (switching) {
//         switching = false;
//         rows = table.rows;
//         for (i = 1; i < (rows.length - 1); i++) {
//             shouldSwitch = false;
//             x = rows[i].getElementsByTagName("TD")[1];
//             y = rows[i + 1].getElementsByTagName("TD")[1];
//             if (x.innerHTML > y.innerHTML) {
//                 shouldSwitch = true;
//                 break;
//             }
//         }
//         if (shouldSwitch) {
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//         }
//     }
// }

function alertApiNotWorking(data = "", status = "") {
    if (data != "" && status != "") {
        alert(`Api is not working right now error : ${data} , status : ${status}`)
        return;
    }
    alert(`Api is not working right now`);
}
