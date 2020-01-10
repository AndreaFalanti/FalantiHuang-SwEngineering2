function capitalizeFirstLetterOnly (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Used for registering a city into server database
function register() {
    $("#successfulMessage").addClass("hidden");
    $("#error").addClass("hidden");

    let name = $("#inputName").val();
    let region = $("#inputRegion").val();

    // Reverse geocoding use capital first letter, so to improve compatibility also save the fields in this format
    name = capitalizeFirstLetterOnly(name);
    region = capitalizeFirstLetterOnly(region);

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