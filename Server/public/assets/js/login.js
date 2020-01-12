// Used for login a user into the web site
function login() {
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();

    let json = JSON.stringify({email, password});

    $.ajax({
        type: "POST",
        url: "/v2/users/login",
        data: json,
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            document.location.href = "/pages/organization.html";
        },
        error: function(errMsg) {
            $("#loginError").removeClass("hidden");
        }
    });
}