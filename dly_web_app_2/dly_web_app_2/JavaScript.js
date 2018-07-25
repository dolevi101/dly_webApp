function login()
{
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    alert(1)
    $.ajax({
        contentType: JSON,
        data: { 'email': email, 'password': password },
        url: "loginurl",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.d === 'Success') {
                window.localStorage.setItem('email', email);
                window.location.href = "#MakeList";
            }
            else { alert("Wrong email or password try again.") }
        };
    });
};