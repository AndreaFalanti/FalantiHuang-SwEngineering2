// Used for registering an organization into server database
function register() {
    $("#successfulMessage").addClass("hidden");
    $("#error").addClass("hidden");

    let name = $("#inputName").val();
    let region = $("#inputRegion").val();

    let json = JSON.stringify({name, region});
    console.log(json);

    $.ajax({
        type: "POST",
        url: "/v2/admin/cities/register",
        data: json,
        contentType: "application/json; charset=utf-8",
        success: function(data){
            $("#successfulMessage").removeClass("hidden");
        },
        error: function(errMsg) {
            $("#error").removeClass("hidden").html(errMsg.statusText);
        }
    });
}