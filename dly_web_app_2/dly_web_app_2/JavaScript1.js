function login() {
    alert(1);
    var username = document.getElementById("username_l");
    var password = document.getElementById("password_l");
    var params = JSON.stringify({ 'username': username, 'password': password });
    alert(params);
    $.ajax({
        contentType: JSON,
        data: JSON.stringify({ 'parameters': params }),
        url: "https://menageusers.azurewebsites.net/api/CheckUserPassword?code=DHfAvU1gxX9j3AxwXgye3f20A/5mNCxWgi2iKyUvZm1iNAzhmOPdtQ==",
        type: "POST",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.d === 'Success') {
                window.localStorage.setItem('username', username);
                window.location.href = "#MakeList";
            }
            else { alert(data.d); }
        }
    });
}

function register() {
    var name = document.getElementById("name_r");
    var username = document.getElementById("username_r");
    var password = document.getElementById("password_r");
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
                window.location.href = "#MakeList";
            }
            else { alert(data.d); }
        }
    });
}