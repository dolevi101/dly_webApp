﻿function openPopup1(name) {
    alert("open popup");
    $("#name_of_item").text("HOW MANY " + name.toUpperCase() + " WOULD YOU LIKE?");
    $("#itemName").val(name);
    $("#quantity_popup").popup("open");
}

function checkNotEmpty(idList) {
    for (let id of idList) {
        if ($("#" + id).val() === "" || $("#" + id).val() === null) {
            alert("all fields must be filled.");
            return false;
        }
    }
    return true;
}

function login() {
    if (!checkNotEmpty(["username_l", "password_l"]))
        return false;
    var username = $("#username_l").val();
    var password = $("#password_l").val();
    var parameters = JSON.stringify({ 'username': username, 'password': password });
    $.ajax({
        contentType: JSON,
        url: "https://manageuser1.azurewebsites.net/api/CheckUserPassword?code=2iiKpSILpGlmte7kFrmhoylGJbLacEVVQw9K/z5hXzN2k/Oprv8LVg==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#options";
            }
            else { alert(data); }
        }
    });
}

function logout() {
    localStorage.removeItem('username');
    window.location.href = "#home";
}

function isUsernameOK() {
    var username = $("#username_r").val();
    if (username === "" || username === null) {
        $("#isUsernameOK").html(" ");
        return;
    }
    var notOK = "<center> username already taken...</center>";
    var OK = "<center> username is OK</center>";
    var parameters = JSON.stringify({ 'username': username});
    $.ajax({
        contentType: JSON,
        url: "https://manageuser1.azurewebsites.net/api/isUsernameOK?code=35GCQ4W2iySJ/hYjQs38Dmh9R3aEYNqPtFwCqMDOOn5MC8/UHQzS5w==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'Success') {
                $("#isUsernameOK").html(OK);
            }
            else {
                $("#isUsernameOK").html(notOK);
            }
        }
    });
}

function register() {
    if (!checkNotEmpty(["username_r", "password_r", "name_r"]))
        return false;
    var isOK = $("#isUsernameOK").html();
    var OK = "<center> username is OK</center>";
    if (isOK !== OK) {
        alert("problem with username.");
        return false;
    }
    var name = $("#name_r").val();
    var username = $("#username_r").val();
    var password = $("#password_r").val();
    var parameters = JSON.stringify({ 'username': username, 'name': name, 'password': password });
    $.ajax({
        contentType: JSON,
        url: "https://manageuser1.azurewebsites.net/api/CreateNewUser?code=a3TvjtUk6/wx3rSFj30skJ/Jyd/IE1HemHn1H2Mle0UhjM8kFHshRg==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#options";
            }
            else { alert(data); }
        }
    });
}

function createListView(data) {
    var json, id, date;
    var lst = "";
    var array = data.split("|");
    $('#oldListsView').html("");
    for (let item of array) {
        json = JSON.parse(item);
        id = json['orderNum'];
        date = json['Date'];
        $('<li>').append('<a href="#" onclick="useList(' + id + ');" style="color: #095680; border-color: #095680; border: solid; background-color: white; font-size: larger;">' + date + '</a>').appendTo('#oldListsView');
    }
    $('#oldListsView').listview().listview('refresh');
}

function oldLists(username) {
    var parameters = JSON.stringify({ 'username': username });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetOrdersFromUsername?code=QdVmZB//EFLn4uCowic9fiWH7il53maCT2Pp7UxVJvG7a0bGrWDQ1A==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === "empty") {
                var str = "<h1 style='color: white'><center>";
                str += "YOU DON'T HAVE ANY LISTS YET.";
                str += "</h1></center>";
                str += "<center><a data-role='button' href='#makeList' class='blueButton' style='border-radius:12px; width:80%; padding-bottom:5%; padding-top:5%; background-color:#095680; border-width:0; color:white;'>MAKE A LIST</a></center>";
                $("#oldListsView").html(str);
            }
            else {
                createListView(data);
            }
        }
    });
}

function showMakeList() {
    if (localStorage.makeList) {
        //load list
        var json, name, quantity;
        var array = (localStorage.shoppingList).split("|");
        $('#current_list').html("");
        for (let item of array) {
            json = JSON.parse(item);
            name = json["itemName"];
            quantity = json["itemQuantity"];

            str = "";
            str += "<table style='width:100%;  background-color:white;'><tr style='width:100%;'>";
            str += "<td style='width:33%;'><center>" + name.toUpperCase() + "</center></td>";
            str += "<td style='width:33%;'><center> <input type='number' style='opacity: 1; ' value='" + quantity + "'> </center></td>";
            str += "<td style='width:33%;'><center> <a data-role='button' class='fa fa-close' style='color: #095680; border-radius: 12px;' role='button' onclick='removeFromList(\"" + name + "\")'></a> </center></td>";
            str += "</tr></table>";
            $('<li>').attr({ 'id': 'item_' + name, 'style': 'color:#095680;' }).append(str).appendTo('#current_list');
        }
        $('#makeList').trigger('create');
    }
    //new list
    getAllItems2();
}

function removeFromList(id) {
    var toRemove = "#item_" + id.replace(" ", "\\ ");
    var i;
    var array = localStorage.shoppingList.split("|");
    var json, name, newShoppingList = "";;
    for (i = 0; i < array.length; i++) {
        json = JSON.parse(array[i]);
        name = json["itemName"];
        if (name === id) {
            continue;
        }
        newShoppingList += "|";
        newShoppingList += array[i];
    }
    
    newShoppingList = newShoppingList.substring(1);
    localStorage.shoppingList = newShoppingList;
    
    $(toRemove).remove();
    $('#makeList').trigger('create');

}


function addItem(name) {
    //TODO:
    //maybe check if item is already on the list and just change quantity or alert about it. 

    //open a popup to enter quantity and then go to addToList
    $("#quantity_popup").popup("close");
    var quantity = $("#quantity_of_item").val();
    alert("add " + quantity + " of " + name);

    addToList(name, quantity);
}

function addToList(name, quantity) {
    var newItem = JSON.stringify({ 'itemName': name, 'itemQuantity': quantity });
    localStorage.shoppingList += "|";
    localStorage.shoppingList += newItem;

    str = "";
    str += "<table style='width:100%;  background-color:white;'><tr style='width:100%;'>";
    str += "<td style='width:33%;'><center>" + name.toUpperCase() + "</center></td>";
    str += "<td style='width:33%;'><center> <input type='number' style='opacity: 2; ' value='" + quantity + "'> </center></td>";
    str += "<td style='width:33%;'><center> <a data-role='button' class='fa fa-close' style='color: #095680; border-radius: 12px;' role='button' onclick='removeFromList(\"" + name + "\")'></a> </center></td>";
    str += "</tr></table>";
    $('<li>').attr({ 'id': 'item_' + name, 'style': 'color:#095680;' }).append(str).appendTo('#current_list');
    $('#makeList').trigger('create');

}

function getAllItems2() {
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetAllItems?code=Ws3K2/EREH0e34YfpzH12ptdVNWbAjwTV/B7cSsV8L6RHOgetOkTCA==",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.includes("error")) {
                alert('an error occured please try again later');
            }
            else {
                $("#items_list").html("");
                items = data.split("|");
                for (let item of items) {
                    $('<li>').attr({ 'id': item, 'style': 'color:#095680;', 'onclick':'openPopup1(\''+item+'\');' }).append(item).appendTo('#items_list');
                }
                $('#items_list').listview().listview('refresh');
            }
        }
    });
}

function loadOldList(id) {
    var json, name, quantity;
    var parameters = JSON.stringify({ 'ordernum': id });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/getList?code=aqr86fF0swe0KotNyXaD7Mo8ZUSKxELH0YK24aSoKI1lsGbaWNjc3Q==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            localStorage.shoppingList = data;
        }
    });
}

function useList(id) {
    localStorage.makeList = true;
    localStorage.saved = false;
    loadOldList(id);
    window.location.href = "#makeList";
}

function saveList() {
    var lst = localStorage.shoppingList;

    //ajax to save full list to database
    // need to finishh
    var parameters = JSON.stringify({ 'username': username });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/InsertListToDB?code=VOrl1V1S0ma1y0nf3tlHySknxO/fveqh0RmVcEgViH7DOF3xY3T/Kg==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) { }
    });
}



function showUsername(id) {
    var username_line="";
    if (localStorage.username) {
        username_line += '<center><a style="font-size:large; color:white;" onclick="logout();">Hi ';
        username_line += localStorage.username;
        username_line += '. logout?</a></center>';
        $(id).html(username_line);
    }
    else
        $(id).text(" ");
}

function startShopping() {
    alert("startShopping");
    var cartID = $("#number").text();
    cartID = cartID[0] + "" + cartID[2] + "" + cartID[4];
    var i;
    for (i = 0; i < 5; i++) { if (cartID[i] !== '-') { break; } }
    cartID = cartID.substring(i);
    var cartNum = parseInt(cartID, 10); 

    //start shopping with this cart. 
    computeRoute(localStorage.super, cartNum, localStorage.names);
}

function makeNewList() {
    localStorage.makeList = true;
    localStorage.saved = false;
    window.location.href = "#makeList";
}

function loadSupermarket() {
    var supermarket = $("#market").val();
    localStorage.super = supermarket;
    var lst = localStorage.shoppingList.split("|");
    var onlyNames = "";
    var expectedQuantities = {};
    //parse the name and quantity of every line in the list
    for (let item of lst) {
        json = JSON.parse(item);
        name = json["itemName"];
        quantity = json["itemQuantity"];
        onlyNames += ",";
        onlyNames += name;
        expectedQuantities[name] = quantity;
    }

    onlyNames = onlyNames.substring(1);
    var changes = "";
    var newOnlyNames = "";
    var q= {};
    //ajax to check if all items exists in inventory
    var parameters = JSON.stringify({ 'superID': supermarket, 'items': onlyNames });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetQuantities?code=aOtFuDMEPFQKJoMUub1RCU9QiiOYjqOVz2Fb4k6bPC8VNN5PccWMKA==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            onlyNames = onlyNames.split(",");
            if (!data.includes('error')) {
                for (let item of onlyNames) {
                    // alert the changes 
                    var actualQuantities = JSON.parse(data);
                    if (expectedQuantities[item] > actualQuantities[item])
                        changes += "Only " + actualQuantities[item] + " of " + item + " in stock. \n";
                    if (actualQuantities[item] !== 0) {
                        //need to remove from items list !!
                        newOnlyNames += ",";
                        newOnlyNames += item;
                        q[item] = Math.min(expectedQuantities[item], actualQuantities[item]);
                    }
                }
                newOnlyNames = newOnlyNames.substring(1);
                if (changes !== "")
                    alert(changes);
                localStorage.names = newOnlyNames;
                localStorage.quantities = JSON.stringify(q);
                localStorage.removeItem("shoppingList");
                localStorage.makeList = false;
                window.location.href = "#selectCart";
            }
            else {
                alert(data);
            }
        }
    });
}

function showSupermarkets() {
    $.ajax({
        contentType: JSON,
        //data: JSON.stringify({ 'parameters': params }),
        url: "https://getallsupermarkets.azurewebsites.net/api/getAllSupermarkets?code=kjYa9Mra0OSLQC/94/Rh4IK2tslhZVNr1azudyaqgU44ZoYZjfwBOw==",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'empty') {
                alert(data);
            }
            else {
                var json, id, name;
                $("#select_placeholder").html("");
                $('<select>').attr({ 'name': 'market', 'id': 'market', 'data-native-menu': 'false' }).appendTo('#select_placeholder');
                $('<option>').html('CHOOSE:').appendTo('#market');
                var array = data.split("|");
                for (let item of array) {
                    json = JSON.parse(item);
                    id = json['superID'];
                    name = json['name'];                    
                    $('<option>').attr({ 'value': id }).html(name).appendTo('#market');
                }
                $('select').selectmenu();
            }
        }
    });

}

function addToPage() {
    var page = $(location).attr('href');
    var hashtag = page.indexOf("#");
    page = page.substring(hashtag);
    //alert(page);
    if (page === "#login" || page === "#register") {
        if (localStorage.username) {
            alert("you are aleady logged in as " + localStorage.username);
            window.location.href = "#logged_in";
        }
    } else if (page === "#makeList") {
        if (!localStorage.username)
            window.location.href = "#homePage";
        showUsername("#makeList_username");
        showMakeList();
    } else if (page === "#oldLists") {
        if (!localStorage.username)
            window.location.href = "#homePage";
        showUsername("#oldLists_username");
        oldLists(localStorage.username);
    }
    else if (page === "#selectSupermarket") {
        if (!localStorage.username) {
            window.location.href = "#homePage";
        }
        //showSupermarkets();
    }
}

function addNum(num) {
    var curr = $("#number").text();
    var arr = curr.split(" ");
    if (num === -1) {
        if (arr[2] === '-') return;
        else {
            arr[2] = arr[1];
            arr[1] = arr[0];
            arr[0] = '-';
        }
    }
    else {
        if (arr[0] !== '-') return;
        else {
            arr[0] = arr[1];
            arr[1] = arr[2];
            arr[2] = num;
        }
    }
    var newNum = arr[0] + " " + arr[1] + " " + arr[2];
    $("#number").text(newNum);
}