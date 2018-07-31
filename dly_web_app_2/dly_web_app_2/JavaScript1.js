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
    //var params = JSON.stringify({ 'username': username, 'password': password });
    $.ajax({
        contentType: JSON,
        //data: JSON.stringify({ 'parameters': params }),
        url: "https://manageuser1.azurewebsites.net/api/CheckUserPassword?code=2iiKpSILpGlmte7kFrmhoylGJbLacEVVQw9K/z5hXzN2k/Oprv8LVg==&parameters={%27username%27:%20%27" + username + "%27,%20%27password%27:%27" + password + "%27}",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#makeList";
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
    if (username === "" || username === null)
        return;
    var notOK = "<center> username already taken...</center>";
    var OK = "<center> username is OK</center>";
  //var params = JSON.stringify({ 'username': username});
    $.ajax({
        contentType: JSON,
        //data: JSON.stringify({ 'parameters': params }),
        url: "https://manageuser1.azurewebsites.net/api/isUsernameOK?code=35GCQ4W2iySJ/hYjQs38Dmh9R3aEYNqPtFwCqMDOOn5MC8/UHQzS5w==&parameters={%27username%27:%20%27" + username + "%27}",
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
    var params = JSON.stringify({ 'username': username, 'name': name, 'password': password });
    $.ajax({
        contentType: JSON,
        data: JSON.stringify({ 'parameters': params }),
        url: "https://manageuser1.azurewebsites.net/api/CreateNewUser?code=a3TvjtUk6/wx3rSFj30skJ/Jyd/IE1HemHn1H2Mle0UhjM8kFHshRg==&parameters={%27username%27:%20%27" + username + "%27,%20%27password%27:%27" + password + "%27,%20%27name%27:%27" + name + "%27}",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#makeList";
            }
            else { alert(data); }
        }
    });
}

function createListView(data) {
    var json, id, date;
    var lst = "";
    var array = data.split("|");
    alert(array[0]);
    for (let item of array) {
        json = JSON.parse(item);
        id = json['orderNum'];
        date = json['Date'];
        lst += "<li data-icon='check'><a class='ui-btn ui-btn-icon-right ui-icon-check' style='color:#095680; border-color:#095680 ;background-color:white; font-size:larger; ' href='#' onclick=useList(" + id + ");" + ">" + date + "</a></li>";
    }
    $("#oldListsView").html(lst);
}

function oldLists(username) {
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetOrdersFromUsername?code=QdVmZB//EFLn4uCowic9fiWH7il53maCT2Pp7UxVJvG7a0bGrWDQ1A==&parameters={%27username%27:%20%27" + username +"%27}",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            createListView(data);
        }
    });
}

function useList(id) {
    var table = "";
    var json, name, quantity;
    $.ajax({
        contentType: JSON,
        url: "url of get list for id&parameters={%27id%27:%20%27" + id + "%27}",
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