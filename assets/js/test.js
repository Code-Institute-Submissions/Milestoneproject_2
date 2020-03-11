var client_id_lastfm = 'API key';
var client_id_misix = 'API key';
var track_id = {};
var artist_id = {};
var firstResponse = {};
var secondResponse = {};

function fetchCountryInformation(){
    var country_id = $("#country_id").val();
    if (!country_id) {
    $("#country_id-data").html(`<p>Please enter country</p>`);
    }
        
    return $.getJSON(`https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=` + country_id + 
    `&api_key=` + client_id_lastfm + `&format=json`, 
    function(data){
        $("#country_id-data").html(`
        <p>No1 Artist: ${data["topartists"]["artist"][0]["name"]}</p>
        <p>No2 Artist: ${data["topartists"]["artist"][1]["name"]}</p>
        <p>No3 Artist: ${data["topartists"]["artist"][2]["name"]}</p>
        <p>No4 Artist: ${data["topartists"]["artist"][3]["name"]}</p>
        <p>No5 Artist: ${data["topartists"]["artist"][4]["name"]}</p>`);
    });
};


function fetchSongInformation(){
    var song_id = $("#song_id").val();
    if (!song_id) {
    $("#song_id-data").html(`<p>Please enter a name of a song</p>`);
    }

    $.ajax({
	url: 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=?&q_track=' + song_id + '&page_size=1&apikey=' + client_id_misix,
	dataType: 'json',
	async: false,
	success: function(firstResponse) {
    if (firstResponse["message"]["header"]["status_code"] === 404) {
            return $("#song_id-data").html(`<p>The song was not found.</p>`)
        } else {
            track_id = firstResponse["message"]["body"]["track_list"][0]["track"]["track_id"];
            artist_id = firstResponse["message"]["body"]["track_list"][0]["track"]["artist_name"];
            console.log(track_id)
        }
    }
    })

    setTimeout(
        $.ajax({
        url: 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=?&track_id=' + track_id + '&apikey=' + client_id_misix,
        dataType: 'json',
        async: false,
        success: function(secondResponse) {
	    console.log(secondResponse)}
    }), 1000)
}
