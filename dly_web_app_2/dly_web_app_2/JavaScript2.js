var route;
var itemsDirectionsMat;
var currentVertexIndex;

function directionsStringToMat(itemsDirectionsString, rows, cols) {
    var itemsDirectionsArray = itemsDirectionsString.split("$");
    var itemsDirectionsMat = [];
    for (var k = 0; k < rows; k++) {
        itemsDirectionsMat[k] = new Array(cols);
    }
    var index = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            itemsDirectionsMat[i][j] = itemsDirectionsArray[index];
            index++;
        }
    }
    return itemsDirectionsMat;
}

/*function createCanvas(i, j, width, height) {
    return "<canvas id=\"Canvas" + i + "," + j + "\" width =\"" + width + "\" height=\"" + height + "\"></canvas>";
}
function createTable(width, height, aisleLength, numOfAisles) {
    var table = ""
    table += "<table id=\"aislesTable\" border =\"1\" width=\"" + (0.9 * width) + "\" height=\"" + height + "\"";
    table += " style = \"position: absolute; left: " + width * 0.05 + "px; top: 0px;\">";
    for (var i = 0; i < aisleLength; i++) {
        table += "<tr id=\"tr" + i + "\" height=\"" + (height / aisleLength) + "\">";
        for (var j = 0; j < numOfAisles; j++) {
            table += "<td id=\"td" + j + "\" width=\"" + (0.9 * width / numOfAisles) + "\">";
            table += createCanvas(i, j, 0.9 * width / numOfAisles, height / aisleLength);
            table += "</td>";
        }
        table += "</tr>";
    }
    table += "</table>";
    return table;
}*/

function createRectangle(canvasName, x, y, width, height) {
    //alert("x, y: " + x + " " + y);
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

function drawMap(aisleLength, numOfAisles) {
    var space = 0.1; //Space for rectangles for the entrance and the counters/exit
    var rectWidthPercent = 0.7;
    var rectHeightPercent = 0.1;
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    var canvas = "<canvas id=\"mapCanvas\" width =\"" + width + "\" height=\"" + ((1 - 2 * space) * height) + "\" style = \"position: absolute; top: " + (space * height) + "px; left: 0px \"></canvas>";
    $("#MapPage").html(canvas);

    var cellWidth = width / numOfAisles;
    var cellHeight = (1 - 2 * space) * height / aisleLength;
    /*var x = 0.05 * cellWidth;
    var y = 0.3 * cellHeight;
    var rectWidth = 0.9 * cellWidth;
    var rectHeight = 0.4 * cellHeight;*/
    for (var i = 0; i < aisleLength; i++) {
        for (var j = 0; j < numOfAisles; j++) {
            var x = ((1 - rectWidthPercent) / 2 + j) * cellWidth;
            var y = ((1 - rectHeightPercent) / 2 + i) * cellHeight;
            createRectangle("mapCanvas", x, y, rectWidthPercent * cellWidth, rectHeightPercent * cellHeight);
        }
    }
    window.location.href = "#MapPage";

}

/*function drawMap(aisleLength, numOfAisles) {//aisleLength = rows / 3, numOfAisles = cols
    //screen.orientation.lock('landscape');
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    var table = createTable(width, height, aisleLength, numOfAisles);
    $("#MapPage").html(table);

    var x = 0.2 * (0.9 * width / numOfAisles);
    var y = 0.05 * (height / aisleLength);
    var rectWidth = 0.6 * (0.9 * width / numOfAisles);
    var rectHeight = 0.9 * (height / aisleLength);
    for (var i = 0; i < aisleLength; i++) {
        for (var j = 0; j < numOfAisles; j++) {
            var canvasName = "Canvas" + i + "," + j;
            createRectangle(canvasName, x, y, rectWidth, rectHeight);
        }
    }
    window.location.href = "#MapPage";
}*/

function computeRoute(superID, itemsList) {
    var parameters = JSON.stringify({ 'superID': superID, 'itemsList': itemsList});
    $.ajax({
        contentType: JSON,
        url: "https://manageitemslist.azurewebsites.net/api/HttpTriggerCSharp1?code=GHkR/DMv0Cvw77Hp5bT6KaD4OK5X8xHnJMhGtDXwaS1VzoNPm/s8KQ==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('An error occured...'); },
        success: function (response) {
            alert(response);
            var responseJson = JSON.parse(response);
            //global variables:
            route = responseJson['route'].split("|");
            var rows = responseJson['rows'];
            var cols = responseJson['cols'];
            itemsDirectionsMat = directionsStringToMat(responseJson['directions'], rows, cols);
            currentVertexIndex = 0;
            drawMap(rows/3, cols);
        }
    });
}

function onNewVertex(row, col) {
    //setTimeout(function () {
        if (route[currentVertexIndex++].split(",")[2] === "0") {
            //An empty vertex
            alert("nope");
        }
        else {
            alert(itemsDirectionsMat[row][col]);
            leftRightItems = itemsDirectionsMat[row][col].split("|");
            left = leftRightItems[0].substring(0, leftRightItems[0].length - 1).split(","); //substring() in order to remove the last comma
            //alert(left);
            right = leftRightItems[1].substring(1).split(","); //substring() in order to remove the first comma
            //alert(right);
            //call function to add the items to the map
        }
    //}, 3000);
}

function openPopup() {
    $("#popupWin").popup("open");
        //evt.preventDefault();
}