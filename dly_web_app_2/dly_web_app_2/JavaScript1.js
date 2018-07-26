function login() {
    var username = document.getElementById("username_l").value;
    var password = document.getElementById("password_l").value;
    var params = JSON.stringify({ 'username': username, 'password': password });
    alert(params);
    $.ajax({
        contentType: JSON,
        beforeSend: function (request) {
            request.setRequestHeader("Access-Control-Allow-Origin", authorizationToken);
        },
        //data: JSON.stringify({ 'parameters': params }),
        url: "https://menageusers.azurewebsites.net/api/CheckUserPassword?code=DHfAvU1gxX9j3AxwXgye3f20A/5mNCxWgi2iKyUvZm1iNAzhmOPdtQ==&parameters={%27username%27:%20%27" + username + "%27,%20%27password%27:%27" + password + "%27}",
        //url: "https://menageusers.azurewebsites.net/api/CheckUserPassword",
        //"https://changecartposition.azurewebsites.net/api/HttpTriggerCSharp1?code=cM5bXc0uMoDzQ6ZyDeLpJaNDJhzldRAutUMXX7RqxprrpGaTgUY4iQ==&name={%27position%27:%20%27"+ cartPosition +"%27,%20%27id%27:%27"+ cartID +"%27}"
        type: "POST",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.d === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#makeList";
            }
            else { alert(data.d); }
        }
    });
}

function register() {
    var name = document.getElementById("name_r").value;
    var username = document.getElementById("username_r").value;
    var password = document.getElementById("password_r").value;
    var params = JSON.stringify({ 'username': username, 'name': name, 'password': password });
    alert(1);
    $.ajax({
        contentType: JSON,
        data: JSON.stringify({ 'parameters': params }),
        url: "https://menageusers.azurewebsites.net/api/CreateNewUser",
        type: "POST",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.d === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#makeList";
            }
            else { alert(data.d); }
        }
    });
}

function oldLists(username) {
    var table = "";

    $.ajax({
        contentType: JSON,
        url: "url of get list for username",
        type: "POST",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            table = data.d;
        }
    });
    $("#oldListsTable").text(table);
}