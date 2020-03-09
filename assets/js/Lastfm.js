var client_id = '0d080d92b5b22fb4c5e349ed087defa8'; // client id

function audioInformationHTML(info) {
    return `<h2>${info["body"]["lyrics"]["lyrics_body"]}</h2>`;
}

function fetchSpotifyInformation(event) {
    $("#track_id-data").html("");

    var track_id = $("#track_id").val();
    if (!track_id) {
        $("#track_id-data").html(`<h2>Please enter song id</h2>`);
        return;
    }

    $("#track_id-data").html(
        `<div id="loader">
            <img src="assets/images/loader.gif" alt="loading..." id="loader-img"/>
            <p>Loading</p>
        </div>`);

    $.getJSON(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=dc02c030eccee4f9620e2021c8ea3a5d&artist=cher&track=believe&format=json`)
    ,function(Data) {
        $("#track_id-data").html(audioInformationHTML(Data))
    },
        function (errorResponse) {
            if (errorResponse.status === 404) {
                $("#sp-id-data").html(
                    `<h2>No info found for user ${audio_Data}</h2>`)
            }
            else {
                console.log(errorResponse);
                $("#sp-id-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        };
}
