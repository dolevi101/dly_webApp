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
            ctx.fillStyle = 'red';
            ctx.fill();
        }
        ctx.stroke();
        xPos += distanceBetweenCircles;
    }
}

function createLine(canvasName, startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos) {//starting point: row -1, col 0 
    var wPos = startWPos;
    var hPos = startHPos;
    var sameRectWDistance = wDistance / 2; //Width distance between points of the same rectangle
    var betRectsWDistance = (cellWidth - wDistance) / 2; //Width distance between points of different rectangles
    var onEdgeWDistance = (cellWidth - wDistance) / 4; //Width distance between points of the same rectangle
    var onEdge = true;

    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    var curr;
    var next;

    ctx.beginPath();
    ctx.moveTo(wPos, hPos);
    wPos -= onEdgeWDistance;
    ctx.lineTo(wPos, hPos);
    hPos += hDistance;
    ctx.lineTo(wPos, hPos);

    for (var i = 0; i < route.length - 1; i++) {
        curr = route[i].split(',');
        next = route[i + 1].split(',');
        if (curr[0] == next[0]) { //Stays on the same row --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (!onEdge) { // The cart just finished the aisle
                if (curr[0] == 0) //Going downwards
                    wPos -= onEdgeWDistance;
                else  //Going upwards
                    wPos += onEdgeWDistance;
                onEdge = true;
                ctx.lineTo(wPos, hPos);
            }
            hPos += hDistance;
            ctx.lineTo(wPos, hPos);
        }
        else { //Stays on the same column --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (onEdge) { //Adding line from the egde to the nearest point
                if (curr[0] == 0) //Going upwards
                    wPos += onEdgeWDistance;
                else //Going downwards
                    wPos -= onEdgeWDistance;
                onEdge = false;
                ctx.lineTo(wPos, hPos);
            }
            if (curr[0] % 3 == 1 || next[0] % 3 == 1) { //The points are of the same rectangle
                if (curr[0] < next[0]) //Going upwards
                    wPos += sameRectWDistance;
                else //Going downwards
                    wPos -= sameRectWDistance;
            }
            else { //The points are of different rectangles
                if (curr[0] < next[0]) //Going upwards
                    wPos += betRectsWDistance;
                else //Going downwards
                    wPos -= betRectsWDistance;
            }
            ctx.lineTo(wPos, hPos);
        }
    }
    // Drawing line to the exit
    curr = route[route.length - 1].split(',');
    if (curr[0] == 0 /*&& !onEdge*/) {
        wPos -= onEdgeWDistance;
        ctx.lineTo(wPos, hPos);
    }
    else if (curr[0] == maxRow /*&& !onEdge*/) {
        wPos += onEdgeWDistance;
        ctx.lineTo(wPos, hPos);
    }
    else if (parseInt(curr[0]) % 3 == 0) {
        wPos += betRectsWDistance;
        ctx.lineTo(wPos, hPos);
    }
    else { //curr[0] % 3 = 2
        wPos += betRectsWDistance;
        ctx.lineTo(wPos, hPos);
    }
    hPos += hDistance * 6 / 7;///////Change both of line if needed
    ctx.lineTo(wPos, hPos);
    wPos = exitRectPos;
    ctx.lineTo(wPos, hPos);
    hPos += hDistance / 7;///////////Change both of line if needed
    ctx.lineTo(wPos, hPos);
    //drawing arrowhead
    var headlen = 20;   // length of head in pixels
    var angle = Math.atan2(hDistance, 0);
    ctx.lineTo(wPos - headlen * Math.cos(angle - Math.PI / 6), hPos - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(wPos, hPos);
    ctx.lineTo(wPos - headlen * Math.cos(angle + Math.PI / 6), hPos - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function createEntrance(canvasName, cellHeight, x, y) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    //Set font size
    var ratio = 1.286;
    var fontSize = cellHeight * 0.5 / ratio;
    ctx.font = fontSize + 'px Arial';
    //The width of the string
    var width = ctx.measureText(" Entrance ").width;
    // draw the rect
    ctx.strokeRect(x, y - cellHeight, width, cellHeight);
    // draw our text
    ctx.fillText(" Entrance ", x, y - cellHeight / 3);
}

function createExit(canvasName, cellHeight, x, y) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    //Set font size
    var ratio = 1.286;
    var fontSize = cellHeight * 0.5 / ratio;
    ctx.font = fontSize + 'px Arial';
    //The width of the string
    var width = ctx.measureText(" Exit ").width;
    x -= width;
    // draw the rect
    ctx.strokeRect(x, y - cellHeight, width, cellHeight);
    // draw our text
    ctx.fillText(" Exit ", x, y - cellHeight / 3);
}

function drawMap(aisleLength, numOfAisles, route, itemsDirectionsMat) { //aisleLength = rows / 3, numOfAisles = cols
    var numOfShelves = parseInt(numOfAisles) + 1;
    var space = 0.05; //Space for the rectangles of the entrance and the counters/exit
    var rectWidthPercent = 0.7;
    var rectHeightPercent = 0.3;
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    var canvas = "<canvas id=\"mapCanvas\" width =\"" + width + "\" height=\"" + height + "\" style = \"position: absolute; top: " + /*height + */"0px; left: 0px \"></canvas>";
    $("#MapPage").html(canvas);

    createEntrance("mapCanvas", space * height, (1 - rectWidthPercent) / 2 * (width / aisleLength), space * height);
    createExit("mapCanvas", space * height, width - (1 - rectWidthPercent) / 2 * (width / aisleLength), height);

    var cellWidth = width / aisleLength;
    var cellHeight = (1 - 2 * space) * height / numOfShelves;
    var radius = rectHeightPercent * cellHeight / 7;
    var distanceBetweenCircles = (rectWidthPercent * cellWidth - 2 * radius - 1 * radius) / 2;
    for (var i = 0; i < aisleLength; i++) {
        for (var j = 0; j < numOfShelves; j++) {
            var x = ((1 - rectWidthPercent) / 2 + i) * cellWidth;
            var y = ((1 - rectHeightPercent) / 2 + j) * cellHeight + space * height;
            createRectangle("mapCanvas", x, y, rectWidthPercent * cellWidth, rectHeightPercent * cellHeight);
            if (j != 0) {
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + radius + 0.5 * radius;
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    isToColor[k] = (itemsDirectionsMat[i * 3 + k][j - 1] != "|");
                }
                create3Circles("mapCanvas", startXPos, yPos, radius, distanceBetweenCircles, isToColor);
            }
            if (j != numOfShelves - 1) {
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + rectHeightPercent * cellHeight - (radius + 0.5 * radius);
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    isToColor[k] = (itemsDirectionsMat[i * 3 + k][j] != "|");
                }
                create3Circles("mapCanvas", startXPos, yPos, radius, distanceBetweenCircles, isToColor);
            }
        }
    }
    var wDistance = rectWidthPercent * cellWidth;
    var hDistance = cellHeight;
    var startWPos = (cellWidth - wDistance) / 2;
    var startHPos = space * height;
    var maxRow = parseInt(aisleLength) * 3 - 1;
    var exitRectPos = width - (1 - rectWidthPercent) / 2 * (width / aisleLength);
    createLine("mapCanvas", startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos);


    /*var image = "<img id=\"Shelf\" width=\"10\" height=\"50\" src=\"Shelf.jpeg\" style=\"display: none; position: absolute; top: 1px; left: 1px; \" alt=\"Shelf\">";
    $("#MapPage").html(image);
    var c = document.getElementById("mapCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("Shelf");
    ctx.drawImage(img, 50, 50);/**/

    window.location.href = "#MapPage";
}

function recolorCircle(canvasName, xPos, yPos, radius, isToColor) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    if (isToColor)
        ctx.fillStyle = 'green';
    else
        ctx.fillStyle = 'LawnGreen';
    ctx.fill();
    ctx.stroke();
}

function computeCirclePosition(i, j, numOfAisles, aisleLength, itemsDirectionsMat) {
//i - the vertex row number (0 < i < aisleLength)
//j - the vertex col number (0 < j < numOfAisles)
    var space = 0.05; //Space for the rectangles of the entrance and the counters/exit
    var rectWidthPercent = 0.7;
    var rectHeightPercent = 0.3;
    var numOfShelves = parseInt(numOfAisles) + 1;

    var height = window.screen.availHeight;
    var cellWidth = window.screen.availWidth / aisleLength;
    var cellHeight = (1 - 2 * space) * height / numOfShelves;
    var radius = rectHeightPercent * cellHeight / 7;
    var distanceBetweenCircles = (rectWidthPercent * cellWidth - 2 * radius - 1 * radius) / 2;

    var xPos = ((1 - rectWidthPercent) / 2 + Math.floor(i / 3)) * cellWidth + distanceBetweenCircles * (i % 3) + radius + 0.5 * radius;
    var y = ((1 - rectHeightPercent) / 2 + j) * cellHeight + space * height;
    if (j === numOfShelves - 1)
        return;
    //up circles
    var yPos1 = y + radius + 0.5 * radius + cellHeight;
    var isToColor1 = (itemsDirectionsMat[i][j] != "|");
    recolorCircle("mapCanvas", xPos, yPos1, radius, isToColor1);
    //down circles
    var yPos2 = y + rectHeightPercent * cellHeight - (radius + 0.5 * radius);
    var isToColor2 = (itemsDirectionsMat[i][j] != "|");
    recolorCircle("mapCanvas", xPos, yPos2, radius, isToColor2);
}

function computeRoute(superID, itemsList) {
    var parameters = JSON.stringify({ 'superID': superID, 'itemsList': itemsList });
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
            drawMap(rows / 3, cols, route, itemsDirectionsMat);

            var parameters = JSON.stringify({ 'cartID': cartID });/////////////////needs cartID
            while (true) {
                $.ajax({
                    contentType: JSON,
                    url: "https://manageitemslist.azurewebsites.net/api/PollingForNewVertex?code=SP3MAK6X4vwWPgJuUEcc2nBTPiTSWsaOm4qPSFB1ONXnmxSnmYgMQw==&parameters=" + parameters,
                    type: "GET",
                    error: function() { alert('An error occured...'); },
                    success: function (response) { //response = "location,row,col"
                        alert(response);
                        var responseJson = JSON.parse(response);
                        
                        if (responseJson['location'] !== currentLocation) {////////needs currentLocation
                            var row = responseJson['row'];
                            var col = responseJson['col'];
                            onNewVertex(row, col)
                        }
                    }
                });
            }
            /*computeCirclePosition(0, 0, 3, 2, itemsDirectionsMat);
            computeCirclePosition(0, 1, 3, 2, itemsDirectionsMat);
            computeCirclePosition(0, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(1, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(2, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(2, 3, 3, 2, itemsDirectionsMat);*/
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
        //need to create a green circle above the red circle we have just visited (maybe save data in the db?)
        //call function to add the items to the map
    }
    //}, 3000);
}

function openPopup() {
    $("#popupWin").popup("open");
    //evt.preventDefault();
}