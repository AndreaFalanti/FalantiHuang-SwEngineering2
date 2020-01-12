// Used for registering an organization into server database
function register() {
    $("#successfulMessage").addClass("hidden");
    $("#error").addClass("hidden");

    let name = $("#inputName").val();
    let domain = $("#inputDomain").val();
    let type = $("#orgTypeSelect").val();
    let city_id = parseInt($("#cityIdSelect").val());

    let json = JSON.stringify({name, domain, type, city_id});
    console.log(json);

    $.ajax({
        type: "POST",
        url: "/v2/admin/organizations/register",
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

function populateCityFilterOptions () {
    fetch("/v2/cities").then(r => r.json())
        .then(cities => {
            let select = $("#cityIdSelect");

            for (let city of cities) {
                let option = $("<option></option>");
                option.html(`${city.id}. ${city.name} (${city.region})`);
                option.val(city.id);

                select.append(option);
            }

            select.selectpicker('refresh');
        });
}