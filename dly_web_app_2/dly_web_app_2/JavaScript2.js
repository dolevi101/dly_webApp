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

function drawMap() {

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
            itemsDirectionsMat = directionsStringToMat(responseJson['directions'], responseJson['rows'], responseJson['cols']);
            currentVertexIndex = 0;
            //call drawMap() 
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