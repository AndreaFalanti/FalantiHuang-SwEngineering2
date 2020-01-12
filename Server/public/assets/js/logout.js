function logOut() {
    $.ajax({
        type: "POST",
        url: "/v2/users/logout",
        contentType: "application/json; charset=utf-8",
        success: function(data){
            document.location.href = "/index.html";
        }
    });
}