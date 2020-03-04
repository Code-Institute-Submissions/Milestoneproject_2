var client_id = '2e774c20cd6e41e5be34f31870baddcf'; // client id
var client_secret = '4f04fdc1f49a444aaf3ceb4698409362'; // secret

function fetchSpotifyInformation(event) {
    $("#sp-id-data").html("");

    var sp-id = $("#sp-id").val();
    if (!sp-id) {
        $("#sp-id-data").html(`<h2>Please enter song id</h2>`);
        return;
    }

    $("#sp-id-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        $.getJSON(`https://api.spotify.com/v1/audio-analysis/${sp-id}`)
    ).then(
        function(firstResponse) {
            var audio_Data = firstResponse[0];
            $("#sp-id-data").html(audioInformationHTML(audio_Data));
        },

        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#sp-id-data").html(
                    `<h2>No info found for user ${audio_Data)}</h2>`);
            } else {
                console.log(errorResponse);
                $("#sp-id-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

function audioInformationHTML(audio) {
    return `
        <h2>${audio.bars}</h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}
