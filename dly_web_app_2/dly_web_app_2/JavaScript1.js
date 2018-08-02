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
        //data: JSON.stringify({ 'parameters': params }),
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
        //data: JSON.stringify({ 'parameters': params }),
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
    alert("old");
    var parameters = JSON.stringify({ 'username': username });
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetOrdersFromUsername?code=QdVmZB//EFLn4uCowic9fiWH7il53maCT2Pp7UxVJvG7a0bGrWDQ1A==&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            alert(data);
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

function showMakeList(id){
    if (id !== -1) {
        //show loaded list
    }
    //new list



}

function useList(id) {
    var table = "";
    var json, name, quantity;
    var parameters = JSON.stringify({ 'id': id });
    $.ajax({
        contentType: JSON,
        url: "url of get list for id&parameters=" + parameters,
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            var array = data.split("|");
            for (let item of array) {

                json = JSON.parse(item);
                name = json['name'];
                quantity = json['quantity'];

                table += "<tr>";
                table += "<td>";
                table += name;
                table += "</td>";
                table += "<td>";
                table += "<input type='number' min='1' placeholder='" + quantity + "' />";
                table += "</td>";
                table += "<td>";
                table += "<center> <a data-role='button' data-icon='delete' id='' style='padding:5%;border-radius:12px; width:90%;background-color:#095680; border-width:0;' onclick=''></a></center>";
                table += "</td>";
                table += "</tr>";
            }
            $("#curretn_list").html(table);
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
    } else if (page === "#oldLists") {
        if (!localStorage.username)
            window.location.href = "#homePage";
        showUsername("#oldLists_username");
        oldLists(localStorage.username);
    }
}