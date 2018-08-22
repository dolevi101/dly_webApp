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

function createLine__Origin(canvasName, startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos) {//starting point: row -1, col 0 
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

function createLine(canvasName, startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos) {//starting point: row -1, col 0 
    var wPos = startWPos;
    var hPos = startHPos;
    var sameRectWDistance = wDistance / 2; //Width distance between points of the same rectangle
    var betRectsWDistance = (cellWidth - wDistance) /*/ 2*/; //Width distance between points of different rectangles
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

    //var toRun = 10;
    for (var i = 0; i < route.length - 1; i++) {
    //for (var i = 0; i < toRun; i++) {
        curr = route[i].split(',');
        next = route[i + 1].split(',');
        if (curr[0] == next[0]) { //Stays on the same row --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (!onEdge && (curr[0] == 0 || curr[0] == maxRow)) { // The cart just finished the aisle
                if (curr[0] == 0) //Going downwards
                    wPos -= onEdgeWDistance;
                else  //Going upwards
                    wPos += onEdgeWDistance;
                onEdge = true;
                ctx.lineTo(wPos, hPos);
                hPos += hDistance;
                ctx.lineTo(wPos, hPos);
            }
            else {
                var s = 1 / 6;
                hPos += s * hDistance;
                ctx.lineTo(wPos, hPos);
                if (curr[0] % 3 == 0)
                    wPos -= betRectsWDistance / 2;
                else if (curr[0] % 3 == 2)
                    wPos += betRectsWDistance / 2;
                ctx.lineTo(wPos, hPos);
                hPos += (1 - s) * hDistance;
                ctx.lineTo(wPos, hPos);
                if (curr[0] % 3 == 0)
                    wPos += betRectsWDistance / 2;
                else if (curr[0] % 3 == 2)
                    wPos -= betRectsWDistance / 2;
            }
        }
        else { //Stays on the same column --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (onEdge) { //Adding line from the egde to the nearest point
                if (curr[0] == 0) //Going upwards
                    wPos += onEdgeWDistance;
                if (curr[0] == maxRow) //Going downwards
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
    ctx.lineTo(wPos - headlen * Math.cos(angle + Math.PI / 6), hPos - headlen * Math.sin(angle + Math.PI / 6));/**/
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
            if (j != 0) { //up
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + radius + 0.5 * radius;
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    isToColor[k] = (itemsDirectionsMat[i * 3 + k][j - 1].includes("|,"));
                }
                create3Circles("mapCanvas", startXPos, yPos, radius, distanceBetweenCircles, isToColor);
            }
            if (j != numOfShelves - 1) { //down
                var startXPos = x + radius + 0.5 * radius;
                var yPos = y + rectHeightPercent * cellHeight - (radius + 0.5 * radius);
                var isToColor = [];
                for (var k = 0; k < 3; k++) {
                    isToColor[k] = (itemsDirectionsMat[i * 3 + k][j].includes(",|"));
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

function computePositionAndRecolorCircles(i, j, numOfAisles, aisleLength, itemsDirectionsMat) {
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

function displayItems(route, routeIndex, itemsDirectionsMat, row, col) {
    if (itemsDirectionsMat[row][col] != "|") {
        alert(itemsDirectionsMat[row][col]);
        allItems = itemsDirectionsMat[row][col].split("|");
        leftItems = allItems[0].substring(0, leftRightItems[0].length - 1).split(","); //substring() in order to remove the last comma
        rightItems = allItems[1].substring(1).split(","); //substring() in order to remove the first comma
        curr = route[routeIndex].split(",");
        if (curr[3] == 0) { // The direction is down --> Changing oriantaion
            var tmp = leftItems;
            leftItems = rightItems;
            rightItems = leftItems;
        }
        var remainder = "Don't forget!!"
            + "\nOn your left: " + leftItems
            + "\nOn your right: " + rightItems;
        alert(remainder);
    }
    else {
        alert("Let's continue!");
    }
}

function navigateRoute(route, cartID, numOfAisles, aislesLength, itemsDirectionsMat) {
    var row = 0;
    var col = 0;
    var routeIndex = 0;
    while (routeIndex < route.length) { //Break when the route is finished
        setTimeout(function () {
            $.ajax({
                contentType: JSON,
                url: "https://manageitemslist.azurewebsites.net/api/PollingForNewVertex?code=SP3MAK6X4vwWPgJuUEcc2nBTPiTSWsaOm4qPSFB1ONXnmxSnmYgMQw==&cartID=" + cartID,
                type: "GET",
                error: function () { alert('An error occured...'); },
                success: function (response) { //response = json(row,col)
                    alert(response);
                    var responseJson = JSON.parse(response);
                    if (responseJson['row'] != row || responseJson['col'] != col) {
                        row = responseJson['row'];
                        col = responseJson['col'];
                        computePositionAndRecolorCircles(row, col, numOfAisles, aisleLength, itemsDirectionsMat);
                        displayItems(route, currentRouteIndex, isUp, itemsDirectionsMat, row, col);
                        routeIndex++;
                    }
                }
            });
        }, 2000);
    }
}

function computeRoute(superID, cartID, itemsList) {
    var parameters = JSON.stringify({ 'superID': superID, 'itemsList': itemsList });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemslist.azurewebsites.net/api/HttpTriggerCSharp1?code=GHkR/DMv0Cvw77Hp5bT6KaD4OK5X8xHnJMhGtDXwaS1VzoNPm/s8KQ==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('An error occured...'); },
        success: function (response) {
            alert(response);
            var responseJson = JSON.parse(response);
            var route = responseJson['route'].split("|");
            var rows = responseJson['rows'];
            var cols = responseJson['cols'];
            var itemsDirectionsMat = directionsStringToMat(responseJson['directions'], rows, cols);
            var aisleLength = rows / 3;
            var numOfAisles = cols
            drawMap(aisleLength, numOfAisles, route, itemsDirectionsMat);
            //navigateRoute(route, cartID, numOfAisles, aislesLength, itemsDirectionsMat);
            
            /*computeCirclePosition(0, 0, 3, 2, itemsDirectionsMat);
            computeCirclePosition(0, 1, 3, 2, itemsDirectionsMat);
            computeCirclePosition(0, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(1, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(2, 2, 3, 2, itemsDirectionsMat);
            computeCirclePosition(2, 3, 3, 2, itemsDirectionsMat);*/
        }
    });
}

function openPopup() {
    $("#popupWin").popup("open");
    //evt.preventDefault();
}