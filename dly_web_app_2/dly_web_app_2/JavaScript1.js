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
        //data: JSON.stringify({ 'parameters': params }),
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
    for (let item of array) {
        json = JSON.parse(item);
        id = json['orderNum'];
        date = json['Date'];
        lst += "<li data-icon='check'><a class='ui-btn ui-btn-icon-right ui-icon-check' style='color:#095680; border-color:#095680; border:solid; background-color:white; font-size:larger; ' href='#' onclick=useList(" + id + ");" + ">" + date + "</a></li>";
    }
    $("#oldListsView").html(lst);
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
    window.location.href = "#makeList";

    if (localStorage.listId) {
        //load list
        var id = localStorage.listId;
        var table = "";
        var json, name, quantity;
        var parameters = JSON.stringify({ 'ordernum': id });
        $.ajax({
            contentType: JSON,
            url: "https://manageitemlist.azurewebsites.net/api/getList?code=aqr86fF0swe0KotNyXaD7Mo8ZUSKxELH0YK24aSoKI1lsGbaWNjc3Q==&parameters=" + parameters,
            type: "GET",
            error: function () { alert('an error occured please try again later'); },
            success: function (data) {
                //var count = 0;
                var lst = "";
                var array = data.split("|");
                for (let item of array) {
                    json = JSON.parse(item);
                    name = json['itemName'];
                    quantity = json['itemQuantity'];

                    lst += '<li id="item_'+name+'" style="color:#095680; height:44px; padding-top:5px;" class="ui-li-static ui-body-inherit ui-first-child">';
                    lst += '<table><tbody><tr style="height:initial;">';
                    lst += ('<td style="width:60%"><center>' + name.toUpperCase() + '</center></td>');
                    lst += ('<td style="width:20%"><center><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="number" style="opacity:1;" value="' + quantity + '"></div></center></td>');
                    lst += '<td style="width:20%"><center><a data-role="button" class="fa fa-close ui-btn" style="color:#095680; border-radius:12px;" role="button" onclick="removeFromList(\'' + name+'\')"></a></center></td>';
                    lst += '</tr></tbody></table>';
                    lst += '</li>';
                    //count = count + 1;

                }
                $("#current_list").html(lst);
            }
        });
    }
    //new list



}


function removeFromList(id) {
    var toRemove = "#item_" + id.replace(" ", "\\ ");
    $(toRemove).remove();
}

function addToList(name, quantity) {
    lst = $("#current_list").html();
    lst += '<li id="item_' + name + '" style="color:#095680; height:44px; padding-top:5px;" class="ui-li-static ui-body-inherit ui-first-child">';
    lst += '<table><tbody><tr style="height:initial;">';
    lst += ('<td style="width:60%"><center>' + name.toUpperCase() + '</center></td>');
    lst += ('<td style="width:20%"><center><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="number" style="opacity:1;" value="' + quantity + '"></div></center></td>');
    lst += '<td style="width:20%"><center><a data-role="button" class="fa fa-close ui-btn" style="color:#095680; border-radius:12px;" role="button" onclick="removeFromList(\'' + name + '\')"></a></center></td>';
    lst += '</tr></tbody></table>';
    lst += '</li>';
    $("#current_list").html(lst);
}

function useList(id) {
    localStorage.listId = id;
    window.location.href = "#makeList";
}

function saveList() {
    var lst = $("#current_list").html();
    var id, name, quantity, index;
    //parse the name and quantity of every line in the list
    var lines = lst.split('<li id="');
    for (let line of lines) {
        index = line.indexOf("\"");
        id = line.substring(0, index);
        name = id.substring(5);
        id = id.replace(" ", "\"");
        quantity = $("#" + id).val();
        addToShoppingList(name, quantity);
    }
}

function addToShoppingList(name, quantity) {
    //TO DO: 
    //this function sends ajax to add this item to a shopping list
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
}