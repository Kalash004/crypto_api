

/**Vytvořte webovou stránku a vložte do ni JS knihovnu jQuery a CSS knihovnu Bootstrap.
Data a popis API pro kryptoměny najděte zde. V
Použijte jQuey ajax funkci na ověřování statusu serveru. V
V případě, že server není dostupný, nagenerujte uživatelsky příjemný Error message a tlačítko na opakovaní requestu. X
V případě, že server je dostupný, vytvořte hezkou tabulku připravenou na zobrazovaní dat. V
Veškeré DOM manipulace provádějte prostřednictvím jQuery selektorů. V
Načtěte ceny pro vybrané kryptoměny a zobrazte výsledky do tabulky. V
Ceny se musejí aktualizovat jednou za 10 vteřin, přičemž doba poslední aktualizace taky musí být uvedena v tabulce. V
Pro každou kryptoměnu nagenerujte tlačítko umožňující uživatelovi provést aktualizaci (server request) manuálně, přičemž počet manuálních aktualizací za minutu musí být omezen. ? */

const STARTING_LINK = "https://api.coingecko.com/api/v3";
const COINS = "/coins";
const PING = "/ping"

let data_collection_started = false;
let whenLastClickedActualization = null;
let connection;
let seconds;
const WAIT_SECONDS_MANUAL_RESTART = 5;
const DATA_UPDATE_MILI_SECONDS = 15000;

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
        data_collection_started = true;
        getCoins(ids)
    }
    )
});

function getCoin(id) {
    if (connection) {

        $.ajax({
            url: STARTING_LINK + COINS + "/" + id,
            type: "GET",
            success: function (data, status) {
                appendData(data);
            },
            error: function (data, status) {
                connection = false;
            }
        });
    }
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
    var buttonHolder = document.createElement("td");
    var button = document.createElement("button");
    timeStamp.value = 0;
    tr.id = data.id;
    button.innerHTML = "Refresh this";
    button.value = data.id;
    button.className = "btn bg-success-subtle";
    button.onclick = function () {updateOneCoin(button.value)};
    empty.innerHTML = "";
    name.innerHTML = data.name;
    usdPrice.innerHTML = data.market_data.current_price.usd;
    timeStamp.innerHTML = timeStamp.value + "s";
    empty.setAttribute("scope", "row");
    tr.appendChild(empty);
    tr.appendChild(name);
    tr.appendChild(usdPrice);
    tr.appendChild(timeStamp);
    buttonHolder.appendChild(button);
    tr.appendChild(buttonHolder);
    $("#table-body").append(tr);
}

function updateTableOneCoin(data) { // seconds
    var table, row;
    table = document.getElementById("dataTable");
    row = document.getElementById(data.id);
    price = row.getElementsByTagName("TD")[1];
    price.innerHTML = data.market_data.current_price.usd;
    time = row.getElementsByTagName("TD")[2];
    time.value = 0;
    time.innerHTML = time.value + "s";
}

function updateOneCoin(id) {
    $.ajax({
        url: STARTING_LINK + COINS + "/" + id,
        type: "GET",
        success: function (data, status) {
            updateTableOneCoin(data)
        },
        error: function (data, status) {
            alertApiNotWorking(data,status);
        }
    });
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
    var buttons = document.createElement("th");
    table.setAttribute("class", "table table-success table-striped")
    table.setAttribute("id", "dataTable");
    buttons.innerHTML = "Refresh";
    nameTh.innerHTML = "Name of Crypto";
    priceUsdTh.innerHTML = "Price in USD";
    timestampTh.innerHTML = "Timestamp";
    buttons.onclick = function () { updateOneCoin(button.value) };
    empty.setAttribute("scope", "col");
    nameTh.setAttribute("scope", "col");
    priceUsdTh.setAttribute("scope", "col");
    timestampTh.setAttribute("scope", "col");
    tbody.setAttribute("id", "table-body");
    tr.appendChild(empty)
    tr.appendChild(nameTh);
    tr.appendChild(priceUsdTh);
    tr.appendChild(timestampTh);
    tr.appendChild(buttons);
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
    if (table == null) return;
    rows = table.rows;
    for (i = 1; i < (rows.length); i++) {
        x = rows[i].getElementsByTagName("TD")[2];
        x.innerHTML = x.value + "s";
    }
}

function updateTable() {
    resetTable();
    getCoins(ids);
    // sortTable();
}

var update_interval = window.setInterval(function () {
    if (!connection) {
        return;
    }
    if (!data_collection_started) {
        return;
    }
    updateTable();
}, DATA_UPDATE_MILI_SECONDS);

var test_interval = window.setInterval(function () {
    testConnection();
}, 60000)

var counter_interval = window.setInterval(function () {
    addSeconds();
    updateTime();
}, 1000);

function addSeconds() {
    var table, rows, i, x;
    table = document.getElementById("dataTable");
    if (table == null) return;
    rows = table.rows;
    for (i = 1; i < (rows.length); i++) {
        x = rows[i].getElementsByTagName("TD")[2];
        x.value = x.value + 1;
    }
}

function testConnectionBtn() {
    $.ajax({
        url: STARTING_LINK + PING,
        type: "GET",
        success: function (data, status) {
            alert("API works !")
            connection = true;
        },
        error: function (data, status) {
            connection = false;
            alertApiNotWorking();
            $("#connTestPlace").html("Status : - API doesnt work !");
        }
    });
}

function testConnection() {
    $.ajax({
        url: STARTING_LINK + PING,
        type: "GET",
        success: function (data, status) {
            $("#connTestPlace").html("Status : " + data.gecko_says + " API works !");
            connection = true;
        },
        error: function (data, status) {
            connection = false;
            alertApiNotWorking();
            $("#connTestPlace").html("Status : - API doesnt work !");
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
