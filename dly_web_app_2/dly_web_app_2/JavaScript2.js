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

function createRectangle(canvasName, x, y, width, height) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

function create3Circles(canvasName, startXPos, yPos, radius, distanceBetweenCircles, isToColor) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    var xPos = startXPos;
    for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        if (isToColor[i]) {
            ctx.fillStyle = 'green';
            ctx.fill();
        }
        ctx.stroke();
        xPos += distanceBetweenCircles;
    }
}

function drawMap(aisleLength, numOfAisles, itemsDirectionsMat) { //aisleLength = rows / 3, numOfAisles = cols
    var space = 0.1; //Space for the rectangles of the entrance and the counters/exit
    var rectWidthPercent = 0.7;
    var rectHeightPercent = 0.3;
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    var canvas = "<canvas id=\"mapCanvas\" width =\"" + width + "\" height=\"" + ((1 - 2 * space) * height) + "\" style = \"position: absolute; top: " + (space * height) + "px; left: 0px \"></canvas>";
    $("#MapPage").html(canvas);

    var cellWidth = width / aisleLength;
    var cellHeight = (1 - 2 * space) * height / numOfAisles;
    var radius = rectHeightPercent * cellHeight / 7;
    var distanceBetweenCircles = (rectWidthPercent * cellWidth - 2 * radius - 1 * radius) / 2;
    for (var i = 0; i < aisleLength; i++) {
        for (var j = 0; j < numOfAisles; j++) {
            var x = ((1 - rectWidthPercent) / 2 + i) * cellWidth;
            var y = ((1 - rectHeightPercent) / 2 + j) * cellHeight;
            createRectangle("mapCanvas", x, y, rectWidthPercent * cellWidth, rectHeightPercent * cellHeight);
            if (j != 0) {
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + radius + 0.5 * radius;
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    //alert("first aisleLength j k i" + aisleLength + " " + j + " " + k + " " + i);
                    alert("first [" + (aisleLength*3 - 1 - i * 3 - k) + "][" + (j - 1) + "]");
                    alert(itemsDirectionsMat[aisleLength*3 - 1 - i * 3 - k][j - 1]);
                    isToColor[k] = (itemsDirectionsMat[aisleLength * 3 - 1 - i * 3 - k][j - 1] != "|");
                }
                create3Circles("mapCanvas", startXPos, yPos, radius, distanceBetweenCircles, isToColor);
            }
            if (j != numOfAisles - 1) {
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + rectHeightPercent * cellHeight - (radius + 0.5 * radius);
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    //alert("second aisleLength j k i " + aisleLength + " " + j + " " + k + " " + i);
                    alert("second [" + (aisleLength*3 - 1 - i * 3 - k) + "][" + (j) + "]");
                    alert(itemsDirectionsMat[aisleLength*3 - 1 - i * 3 - k][j]);
                    isToColor[k] = (itemsDirectionsMat[aisleLength * 3 - 1 - i * 3 - k][j] != "|");
                }
                create3Circles("mapCanvas", startXPos, yPos, radius, distanceBetweenCircles, isToColor);
            }
        }
    }
    window.location.href = "#MapPage";
}

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
            drawMap(rows / 3, cols, itemsDirectionsMat);
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