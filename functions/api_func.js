
function Net(url, req = "GET") {
    let data = "";
    $.ajax({
        url: url,
        type: req,
        timeout: 10000,
        async: false,
        error: function(){},
        success: function(e) {
            data = e;
        }
    });
    return data;
}