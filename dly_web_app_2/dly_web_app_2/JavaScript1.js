function openPopup1(name) {
    $("#name_of_item").text("HOW MANY " + name.toUpperCase() + " WOULD YOU LIKE?");
    $("#itemName").val(name);
    $("#quantity_popup").popup("open");
}

function checkNotEmpty(idList) {
    for (let id of idList) {
        if ($("#" + id).val() === "" || $("#" + id).val() === null) {
            alert("All fields must be filled.");
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
        error: function () { alert('An error occured please try again later.'); },
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
        error: function () { alert('An error occured please try again later.'); },
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
        alert("Problem with username.");
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
        error: function () { alert('An error occured please try again later.'); },
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
        error: function () { alert('An error occured please try again later.'); },
        success: function (data) {
            if (data === "empty") {
                alert("You don't have any lists yet. Create a new one.");
                window.location.href = "#makeList";
            }
            else {
                createListView(data);
            }
        }
    });
}

function showMakeList() {
    $('#current_list').html("");
    localStorage.changed = false;
    if (localStorage.shoppingList) {
        //load list
        var json, name, quantity;
        var array = (localStorage.shoppingList).split("|");
        for (let item of array) {
            json = JSON.parse(item);
            name = json["itemName"];
            quantity = json["itemQuantity"];

            str = "";
            str += "<table style='width:100%;  background-color:white;'><tr style='width:100%;'>";
            str += "<td style='width:33%;'><center>" + name.toUpperCase() + "</center></td>";
            str += "<td style='width:33%;'><center> <input type='number' id='" + name + "_number' onchange='changeQuantity(\"" + name + "\");' style='opacity: 2; ' value='" + quantity + "'> </center></td>";
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
    localStorage.changed = true;
    var toRemove = "#item_" + id.replace(" ", "\\ ");
    var i;
    var array = localStorage.shoppingList.split("|");
    var json, name, newShoppingList = "";
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
    if (quantity == "") {
        quantity = 1;
    }

    addToList(name, quantity);
}

function addToList(name, quantity) {
    localStorage.changed = true;
    var newItem = JSON.stringify({ 'itemName': name, 'itemQuantity': quantity });
    if (localStorage.shoppingList != null && localStorage.shoppingList != "")
        localStorage.shoppingList += "|";
    else { localStorage.shoppingList = "";}
    localStorage.shoppingList += newItem;

    str = "";
    str += "<table style='width:100%;  background-color:white;'><tr style='width:100%;'>";
    str += "<td style='width:33%;'><center>" + name.toUpperCase() + "</center></td>";
    str += "<td style='width:33%;'><center> <input type='number' id='" + name +"_number' onchange='changeQuantity(\""+name+"\");' style='opacity: 2; ' value='" + quantity + "'> </center></td>";
    str += "<td style='width:33%;'><center> <a data-role='button' class='fa fa-close' style='color: #095680; border-radius: 12px;' role='button' onclick='removeFromList(\"" + name + "\")'></a> </center></td>";
    str += "</tr></table>";
    $('<li>').attr({ 'id': 'item_' + name, 'style': 'color:#095680;' }).append(str).appendTo('#current_list');
    $('#makeList').trigger('create');

}

function changeQuantity(id) {
    var newQuantity = $("#"+id+"_number").val();
    var array = localStorage.shoppingList.split("|");
    var json, name, newShoppingList = "";
    for (i = 0; i < array.length; i++) {
        newShoppingList += "|";
        json = JSON.parse(array[i]);
        name = json["itemName"];
        if (name === id) {
            newShoppingList += JSON.stringify({ "itemName": id, "itemQuantity": newQuantity });
        }
        else {
            newShoppingList += array[i];
        }
    }

    newShoppingList = newShoppingList.substring(1);
    localStorage.shoppingList = newShoppingList;

}

function getAllItems2() {
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetAllItems?code=Ws3K2/EREH0e34YfpzH12ptdVNWbAjwTV/B7cSsV8L6RHOgetOkTCA==",
        type: "GET",
        error: function () { alert('An error occured please try again later.'); },
        success: function (data) {
            if (data.includes("error")) {
                alert('An error occured please try again later.');
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
        error: function () { alert('An error occured please try again later.'); },
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

function startNav() {
    if (!localStorage.shoppingList) {
        alert("Your list is empty!")
        localStorage.removeItem("shoppingList");
        localStorage.removeItem("makeList");
        window.location.href = "#options";
        return;
    }

    lst = localStorage.shoppingList;
    if (lst == undefined || lst == null || lst == "") {
        alert("Your list is empty!")
        localStorage.removeItem("shoppingList");
        localStorage.removeItem("makeList");
        window.location.href = "#options";
        return;
    }

    window.location.href = "#selectSupermarket";
}

function saveList() {
    if (!localStorage.shoppingList) {
        alert("Your list is empty!")
        //localStorage.removeItem("shoppingList");
        localStorage.removeItem("makeList");
        window.location.href = "#options";
        return;
    }

    var lst = localStorage.shoppingList;
    if (lst == undefined || lst == null || lst == "") {
        localStorage.removeItem("shoppingList");
        localStorage.removeItem("makeList");
        window.location.href = "#options";
        return; 
    }

    if (localStorage.changed === "false") {
        alert("No changes where made to the list, nothing to save.");
        localStorage.removeItem("makeList");
        localStorage.removeItem("changed");
        window.location.href = "#options";
        return;
    }

    //ajax to save full list to database
    var userAndSuperId = JSON.stringify({ 'username': localStorage.username, 'superID': 0});
    var parameters = userAndSuperId + "|" + lst;
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/InsertListToDB?code=VOrl1V1S0ma1y0nf3tlHySknxO/fveqh0RmVcEgViH7DOF3xY3T/Kg==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('An error occured please try again later.'); },
        success: function (data) {
            if (data.includes('Success'))
                alert('List saved.');
            else
                alert(data);
            
            localStorage.removeItem("shoppingList");
            localStorage.removeItem("makeList");
            window.location.href = "#options";
        }
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
    var cartID = $("#number").text();
    cartID = cartID[0] + "" + cartID[2] + "" + cartID[4];
    var i;
    for (i = 0; i < 5; i++) { if (cartID[i] !== '-') { break; } }
    cartID = cartID.substring(i);
    var cartNum = parseInt(cartID, 10); 

    //start shopping with this cart. 
    var superid = localStorage.super;
    var names = localStorage.names;
    localStorage.removeItem("names");
    computeRoute(superid, cartNum, names);
}

function makeNewList() {
    localStorage.makeList = true;
    localStorage.removeItem("shoppingList");
    localStorage.saved = false;
    window.location.href = "#makeList";
}

function loadSupermarket() {
    var supermarket = $("#market").val();
    localStorage.super = supermarket;
    //save the shoppinglist
    var lst1 = localStorage.shoppingList;
    var lst = localStorage.shoppingList.split("|");
    var onlyNames = "";
    var expectedQuantities = {};

    //ajax to save full list to database
    if (localStorage.changed === "false") {
        alert("No changes where made to the list, nothing to save");
        localStorage.removeItem("makeList");
        localStorage.removeItem("changed");
    }
    else {
    var userAndSuperId = JSON.stringify({ 'username': localStorage.username, 'superID': 0 });
    var parameters = userAndSuperId + "|" + lst1;
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/InsertListToDB?code=VOrl1V1S0ma1y0nf3tlHySknxO/fveqh0RmVcEgViH7DOF3xY3T/Kg==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('An error occured please try again later.'); },
        success: function (data) { if (data.includes('Success')) alert('List saved.'); }
    });
}
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
        error: function () { alert('An error occured please try again later.'); },
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
                localStorage.removeItem("makeList");
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
        error: function () { alert('An error occured please try again later.'); },
        success: function (data) {
            if (data === 'empty') {
                alert(data);
            }
            else {
                var json, id, name;
                $("#market").html("");
                //$('<select>').attr({ 'name': 'market', 'id': 'market', 'data-native-menu': 'false'}).appendTo('#select_placeholder');
                $('<option>').html('CHOOSE:').appendTo('#market');
                var array = data.split("|");
                for (let item of array) {
                    json = JSON.parse(item);
                    id = json['superID'];
                    name = json['name'];                    
                    $('<option>').attr({ 'value': id }).html(name).appendTo('#market');
                }
                $('#market').selectmenu('refresh');
            }
        }
    });

}

function addToPage() {
    var page = $(location).attr('href');
    var hashtag = page.indexOf("#");
    page = page.substring(hashtag);
    if (page === "#login" || page === "#register") {
        if (localStorage.username) {
            alert("You are aleady logged in as " + localStorage.username+".");
            window.location.href = "#logged_in";
            return;
        }
    } else if (page === "#makeList") {
        if (!localStorage.username) {
            window.location.href = "#home";
            return;
        }
        showUsername("#makeList_username");
        showMakeList();
    } else if (page === "#oldLists") {
        if (!localStorage.username) {
            window.location.href = "#home";
            return;
        }
        showUsername("#oldLists_username");
        oldLists(localStorage.username);
    }
    else if (page === "#options") {
        if (!localStorage.username) {
            window.location.href = "#home";
            return;
        }
        showUsername("#options_username");
    }
    else if (page === "#selectSupermarket") {
        if (!localStorage.username) {
            window.location.href = "#home";
            return;
        }
        if (!localStorage.shoppingList) {
            alert("Oops! you are not supposedd to be here.");
            window.location.href = "#options";
            return;
        }
        if (localStorage.shoppingList == undefined || localStorage.shoppingList == null || localStorage.shoppingList == "") {
            alert("Oops! you are not supposed to be here.");
            window.location.href = "#options";
            return;
        }
        showSupermarkets();
    }
    else if (page === "#selectCart") {
        if (!localStorage.username) {
            window.location.href = "#home";
            return;
        }
        if (!localStorage.names) {
            alert("Oops! you are not supposed to be here.");
            window.location.href = "#options";
            return;
        }

        if (localStorage.names == undefined || localStorage.names == null || localStorage.names == "") {
            alert("Oops! you are not supposedd to be here.");
            window.location.href = "#options";
            return;
        }
    }
}

function addNum(num) {
    var curr = $("#number").text();
    var arr = curr.split(" ");
    if (num === -1) {
        var i;
        for (i = 2; i >=0  ; i--) { if (arr[i] !== '-') break; }
        if (i < 0) { return; }
        else { arr[i] = '-'; }
    }
    else {
        var i;
        for (i = 0; i < 3; i++) { if (arr[i] === '-') break; }
        if (i == -1) { return; }
        else { arr[i] = num; }
    }
    var newNum = arr[0] + " " + arr[1] + " " + arr[2];
    $("#number").text(newNum);
}
