﻿function directionsStringToMat(itemsDirectionsString, rows, cols) {
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

function drawBorder(ctx, xPos, yPos, width, height) {
    var thickness = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function createRectangle(canvasName, x, y, width, height) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");

    drawBorder(ctx, x, y, width, height);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(x, y, width, height);

    /*ctx.rect(x, y, width, height);
    ctx.stroke();*/
}

function create3Circles(canvasName, startXPos, yPos, radius, distanceBetweenCircles, isToColor) {
    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    var xPos = startXPos;
    for (var i = 0; i < 3; i++) {
        if (isToColor[i]) {
            ctx.beginPath();
            ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
            //if (isToColor[i]) {
            ctx.fillStyle = 'white';//'#02334E';
            ctx.lineWidth = 3;
            ctx.fill();
            //}
            ctx.stroke();
            ctx.lineWidth = 1;

        }
        xPos += distanceBetweenCircles;
    }
}

function createLine3(canvasName, startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos) {//starting point: row -1, col 0 
    var wPos = startWPos;
    var hPos = startHPos;
    var sameRectWDistance = wDistance / 2; //Width distance between points of the same rectangle
    var betRectsWDistance = (cellWidth - wDistance); //Width distance between points of different rectangles
    var onEdgeWDistance = (cellWidth - wDistance) / 4; //Width distance between points of the same rectangle
    var already1Div6 = 0;
    var need1Div6 = 0;
    var directionsOfItems = [];
    var absoluteDirection = 1;

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
            if (need1Div6 > 0) { //Adding the missing hDistance/6
                hPos += hDistance / 6 * need1Div6;
                need1Div6 = 0;
            }
            if (i < route.length - 2) { //In the next aisle, not going in the same direction as planned
                var after = route[i + 2].split(',');
                if (next[0] != after[0] && Math.sign(after[3] - 0.5) != Math.sign(after[0] - next[0])) {
                    hPos -= hDistance / 6;
                    need1Div6++;
                }
            }
            if (already1Div6 > 0) {
                hPos -= hDistance / 6 * already1Div6;
                already1Div6 = 0;
            }
            hPos += hDistance;
            ctx.lineTo(wPos, hPos);
        }
        else { //Stays on the same column --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (i > 0) {
                var prev = route[i - 1].split(',');
                if (Math.sign(prev[0] - curr[0]) == Math.sign(next[0] - curr[0])) { // changing direction after getting to max/min of the aisle
                    hPos += hDistance / 6;
                    ctx.lineTo(wPos, hPos);
                    already1Div6++;

                }
            }
            if (Math.abs(curr[0] - next[0]) == 0.5) {
                if (curr[0] > 0 && curr[0] < maxRow)
                    wPos += betRectsWDistance * (next[0] - curr[0]);
                else
                    wPos += onEdgeWDistance * (next[0] - curr[0]) * 2;
                (next[0] - curr[0] > 0) ? absoluteDirection = 1 : absoluteDirection = 0;////////////////////////////////////////
                ctx.lineTo(wPos, hPos);
            }
            else {
                if (curr[0] % 3 == 1 || next[0] % 3 == 1) { //The points are of the same rectangle
                    if (curr[0] < next[0]) //Going upwards
                        wPos += sameRectWDistance;
                    else //Going downwards
                        wPos -= sameRectWDistance;
                    (curr[0] < next[0]) ? absoluteDirection = 1 : absoluteDirection = 0;
                }
                else { //The points are of different rectangles
                    if (curr[0] < next[0]) //Going upwards
                        wPos += betRectsWDistance;
                    else //Going downwards
                        wPos -= betRectsWDistance;
                    (curr[0] < next[0]) ? absoluteDirection = 1 : absoluteDirection = 0;
                }
                ctx.lineTo(wPos, hPos);
            }
        }
        if (curr[0] % 1 == 0)
            directionsOfItems.push(absoluteDirection);
        else
            directionsOfItems.push(2);
    }
    if (need1Div6 > 0)
        hPos += hDistance / 6 * need1Div6;
    if (already1Div6 > 0)
        hPos -= hDistance / 6 * already1Div6;
    hPos += hDistance * 6 / 7;///////Change both of line if needed
    ctx.lineTo(wPos, hPos);
    wPos = exitRectPos;
    ctx.lineTo(wPos, hPos);
    hPos += hDistance / 7;///////////Change both of line if needed
    ctx.lineTo(wPos, hPos);
    //drawing arrowhead
    //var headlen = 20;   // length of head in pixels
    var headlen = hDistance / 7 * 0.6; // length of head in pixels
    var angle = Math.atan2(hDistance, 0);
    ctx.lineTo(wPos - headlen * Math.cos(angle - Math.PI / 6), hPos - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(wPos, hPos);
    ctx.lineTo(wPos - headlen * Math.cos(angle + Math.PI / 6), hPos - headlen * Math.sin(angle + Math.PI / 6));/**/
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    return directionsOfItems;
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
    drawBorder(ctx, x, y - cellHeight, width, cellHeight);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(x, y - cellHeight, width, cellHeight);/**/
    //ctx.strokeRect(x, y - cellHeight, width, cellHeight);

    // draw our text
    ctx.fillStyle = "black";
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
    drawBorder(ctx, x, y - cellHeight, width, cellHeight);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(x, y - cellHeight, width, cellHeight);/**/
    //ctx.strokeRect(x, y - cellHeight, width, cellHeight);

    // draw our text
    ctx.fillStyle = "black";
    ctx.fillText(" Exit ", x, y - cellHeight / 3);
}

function drawMap(aisleLength, numOfAisles, route, itemsDirectionsMat) { //aisleLength = rows / 3, numOfAisles = cols
    var numOfShelves = parseInt(numOfAisles) + 1;
    var space = 0.05; //Space for the rectangles of the entrance and the counters/exit
    var rectWidthPercent = 0.7;
    var rectHeightPercent = 0.3;
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;

    var canvas = "<canvas id=\"mapCanvas\" width =\"" + width + "\" height=\"" + height + "\" style = \"position: absolute; top: 0px; left: 0px; background: #095680\"></canvas>";
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
    window.location.href = "#MapPage";
    return createLine3("mapCanvas", startWPos, startHPos, cellWidth, wDistance, hDistance, route, maxRow, exitRectPos);
    
}

function recolorCircle(canvasName, xPos, yPos, radius, isToColor, i, j) {
    if (isToColor) {
        var c = document.getElementById(canvasName);
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius * 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = '#00b300';
        ctx.fill();
    }
}

function computePositionAndRecolorCircles(i, j, numOfAisles, aisleLength, itemsDirectionsMat) {
    //i - the vertex row number (0 < i < aisleLength * 3)
    //j - the vertex col number (0 < j < numOfAisles)
    i = parseInt(i);
    j = parseInt(j);
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
    var isToColor1 = (itemsDirectionsMat[i][j].includes("|,"));
    recolorCircle("mapCanvas", xPos, yPos1, radius, isToColor1);
    //down circles
    var yPos2 = y + rectHeightPercent * cellHeight - (radius + 0.5 * radius);
    var isToColor2 = (itemsDirectionsMat[i][j].includes(",|"));
    recolorCircle("mapCanvas", xPos, yPos2, radius, isToColor2);
}

function displayItems(curr, itemsDirectionsMat, row, col, directionOfItem) {
    if (itemsDirectionsMat[row][col] != "|") {
        //alert(itemsDirectionsMat[row][col]);
        var allItems = itemsDirectionsMat[row][col].split("|");
        var leftItems = allItems[0].substring(0, allItems[0].length - 1).split(","); //substring() in order to remove the last comma
        var rightItems = allItems[1].substring(1).split(","); //substring() in order to remove the first comma
        if (directionOfItem == 0) { // The direction is down --> Changing oriantaion
            var tmp = leftItems;
            leftItems = rightItems;
            rightItems = tmp;
        }

        var quantities = JSON.parse(localStorage.quantities);

        var reminder = "Don't forget!!";
        if (leftItems != "") {
            //reminder += "\nOn your left: " + leftItems;
            reminder += "\nOn your left: ";
            for (var i = 0; i < leftItems.length; i++) {
                reminder += "\n" + quantities[leftItems[i]] + " " + leftItems[i];
            }
            //reminder += "\n" + quantities[leftItems[leftItems.length - 1]] + " " + leftItems[i];
        }
        if (rightItems != "") {
            //reminder += "\nOn your right: " + rightItems;
            reminder += "\nOn your right: ";
            for (var i = 0; i < rightItems.length; i++) {
                reminder += "\n" + quantities[rightItems[i]] + " " + rightItems[i];
            }
            //reminder += "\n" + quantities[rightItems[rightItems.length - 1]] + " " + rightItems[i];
        }
        setTimeout(function () { alert(reminder); }, 10);
    }
    /*else {
        alert("Let's continue!");
    }*/
}

function recolorLine(route, routeIndex, aisleLength, numOfShelves, done) { 
    var canvasName = "mapCanvas";
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    var rectWidthPercent = 0.7;
    var space = 0.05;
    var cellWidth = width / aisleLength;
    var cellHeight = (1 - 2 * space) * height / numOfShelves;
    var wDistance = rectWidthPercent * cellWidth;
    var hDistance = cellHeight;
    var startWPos = (cellWidth - wDistance) / 2;
    var startHPos = space * height;
    var maxRow = parseInt(aisleLength) * 3 - 1;
    var exitRectPos = width - (1 - rectWidthPercent) / 2 * (width / aisleLength);
    
    var wPos = startWPos;
    var hPos = startHPos;
    var sameRectWDistance = wDistance / 2; //Width distance between points of the same rectangle
    var betRectsWDistance = (cellWidth - wDistance); //Width distance between points of different rectangles
    var onEdgeWDistance = (cellWidth - wDistance) / 4; //Width distance between points of the same rectangle
    var already1Div6 = 0;
    var need1Div6 = 0;

    var c = document.getElementById(canvasName);
    var ctx = c.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'gray';
    var curr;
    var next;

    ctx.beginPath();
    ctx.moveTo(wPos, hPos);
    wPos -= onEdgeWDistance;
    ctx.lineTo(wPos, hPos);
    hPos += hDistance;
    ctx.lineTo(wPos, hPos);

    if (done)
        routeIndex = route.length - 2;

    for (var i = 0; i <= routeIndex; i++) {
    //while (i < routeIndex) {
        curr = route[i].split(',');
        next = route[i + 1].split(',');
        if (curr[0] == next[0]) { //Stays on the same row --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (need1Div6 > 0) { //Adding the missing hDistance/6
                hPos += hDistance / 6 * need1Div6;
                need1Div6 = 0;
            }
            if (i < route.length - 2) { //In the next aisle, not going in the same direction as planned
                var after = route[i + 2].split(',');
                if (next[0] != after[0] && Math.sign(after[3] - 0.5) != Math.sign(after[0] - next[0])) {
                    hPos -= hDistance / 6;
                    need1Div6++;
                }
            }
            if (already1Div6 > 0) {
                hPos -= hDistance / 6 * already1Div6;
                already1Div6 = 0;
            }
            hPos += hDistance;
            ctx.lineTo(wPos, hPos);
        }
        else { //Stays on the same column --> add a line from (wPos, hPos) to (wPos, hPos + hDistance)
            if (i > 0) {
                var prev = route[i - 1].split(',');
                if (Math.sign(prev[0] - curr[0]) == Math.sign(next[0] - curr[0])) { // changing direction after getting to max/min of the aisle
                    hPos += hDistance / 6;
                    ctx.lineTo(wPos, hPos);
                    already1Div6++;
                }
            }
            if (Math.abs(curr[0] - next[0]) == 0.5) {
                if (curr[0] > 0 && curr[0] < maxRow)
                    wPos += betRectsWDistance * (next[0] - curr[0]);
                else
                    wPos += onEdgeWDistance * (next[0] - curr[0]) * 2;
                ctx.lineTo(wPos, hPos);
            }
            else {
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
        if (i == routeIndex - 1) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(wPos, hPos);
        }
        if (i == routeIndex && already1Div6 > 0) {
            ctx.stroke();
        }
    }
    if (done) {
        if (need1Div6 > 0)
            hPos += hDistance / 6 * need1Div6;
        if (already1Div6 > 0)
            hPos -= hDistance / 6 * already1Div6;
        hPos += hDistance * 6 / 7;///////Change both of line if needed
        ctx.lineTo(wPos, hPos);
        wPos = exitRectPos;
        ctx.lineTo(wPos, hPos);
        hPos += hDistance / 7;///////////Change both of line if needed
        ctx.lineTo(wPos, hPos);
        //drawing arrowhead
        //var headlen = 20;   // length of head in pixels
        var headlen = hDistance / 7 * 0.6; // length of head in pixels
        var angle = Math.atan2(hDistance, 0);
        ctx.lineTo(wPos - headlen * Math.cos(angle - Math.PI / 6), hPos - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(wPos, hPos);
        ctx.lineTo(wPos - headlen * Math.cos(angle + Math.PI / 6), hPos - headlen * Math.sin(angle + Math.PI / 6));/**/
        ctx.stroke();
    }
    /*ctx.lineWidth = 5;
    ctx.strokeStyle = "gray";*/
    //ctx.stroke();
}

function navigateRoute(route, cartID, numOfAisles, aisleLength, itemsDirectionsMat, routeIndex, row, col, directionsOfItems) {
    while (routeIndex < route.length && route[routeIndex].split(",")[0] % 1 != 0) //Break when the route is finished        
        routeIndex++;
    
    if (routeIndex == route.length) {
        recolorLine(route, routeIndex, aisleLength, parseInt(numOfAisles) + 1, true);
        alert("Done!");
        return;
    }

    var newPosition = route[routeIndex].split(",");
    /*$.ajax({
        contentType: JSON,
        url: "https://manageitemslist.azurewebsites.net/api/UpdatingPositionManualy?code=VS25ItApL1ijOh1CaI7tLU/97UziIT5PGIAT5am1ljDm0Dm9UkNeHQ==&parameters=" + newPosition[0] + "," + newPosition[1] + "," + cartID,
        type: "GET",
        error: function () { alert('Failed updating...'); },
        success: function () { }//alert("Updated successfully : " + newPosition[0] + " " + newPosition[1]);}
    });*/

    setTimeout(function () {
        $.ajax({
            contentType: JSON,
            url: "https://manageitemslist.azurewebsites.net/api/PollingForNewVertex?code=SP3MAK6X4vwWPgJuUEcc2nBTPiTSWsaOm4qPSFB1ONXnmxSnmYgMQw==&cartID=" + cartID,
            type: "GET",
            error: function () { //alert('An error occured...'); 
            },
            success: function (response) { //response = json(row,col)
                //alert("response = " + response);
                var responseJson = JSON.parse(response);
                var newPosition = route[routeIndex].split(",");
                if (responseJson['row'] != row || responseJson['col'] != col) {
                    //alert("responseJson['row'] = " + responseJson['row'] + "\nrow = " + row + "\nresponseJson['col'] = " + responseJson['col'] + "\ncol = " + col + "\nnewPosition[0] = " + newPosition[0] + "\nnewPosition[1] = " + newPosition[1]);
                    if (newPosition[0] == responseJson['row'] && newPosition[1] == responseJson['col']) {
                        row = responseJson['row'];
                        col = responseJson['col'];
                        if (newPosition[2] == 1) { //There are products now
                            computePositionAndRecolorCircles(row, col, numOfAisles, aisleLength, itemsDirectionsMat);
                        }



                        recolorLine(route, routeIndex, aisleLength, parseInt(numOfAisles) + 1, false);



                        displayItems(route[routeIndex], itemsDirectionsMat, row, col, directionsOfItems[routeIndex]);
                        routeIndex++;
                    }
                    else
                        alert("Please continue along the suggested route :)");
                }
                setTimeout(function () {
                    navigateRoute(route, cartID, numOfAisles, aisleLength, itemsDirectionsMat, routeIndex, row, col, directionsOfItems);
                }, 10);
            }
        });
    }, 1000);
}

function resetCartPosition(cartID) { ////////////////////////////maually updating shopping carts positions
    $.ajax({
        contentType: JSON,
        url: "https://manageitemslist.azurewebsites.net/api/UpdatingPositionManualy?code=VS25ItApL1ijOh1CaI7tLU/97UziIT5PGIAT5am1ljDm0Dm9UkNeHQ==&parameters=" + "-1,-1," + cartID,
        type: "GET",
        error: function () { //alert('Failed reseting...'); 
        },
        success: function () { /*alert("Updated successfully");*/ }
    });
}

function computeRoute(superID, cartID, itemsList) {
    var parameters = JSON.stringify({ 'superID': superID, 'itemsList': itemsList });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemslist.azurewebsites.net/api/HttpTriggerCSharp1?code=GHkR/DMv0Cvw77Hp5bT6KaD4OK5X8xHnJMhGtDXwaS1VzoNPm/s8KQ==&parameters=" + parameters,
        type: "GET",
        error: function () { //alert('An error occured in computeRoute...'); 
        },
        success: function (response) {
            //alert(response);
            var responseJson = JSON.parse(response);
            var route = responseJson['route'].split("|");
            var rows = responseJson['rows'];
            var cols = responseJson['cols'];
            var itemsDirectionsMat = directionsStringToMat(responseJson['directions'], rows, cols);
            var aisleLength = rows / 3;
            var numOfAisles = cols;
            var directionsOfItems = drawMap(aisleLength, numOfAisles, route, itemsDirectionsMat);
            //alert(directionsOfItems);
            setTimeout(function () {
                navigateRoute(route, cartID, numOfAisles, aisleLength, itemsDirectionsMat, 0, -1, -1, directionsOfItems);
                resetCartPosition(cartID);
            }, 1000);
            setTimeout(function () { window.location.href = "#options";}, 5000);
            
        }
    });
}