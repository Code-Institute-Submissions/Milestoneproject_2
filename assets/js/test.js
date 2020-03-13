var musix_api_url = 'https://api.musixmatch.com/ws/1.1/'
var client_id_misix = 'API key'
var client_id_lastfm = 'API key';

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

// Auto Complete
function getAutocomplete() {
let the_id = $("#song_id").val();
$("#song_id").autocomplete({
    source: function(response){
        $.ajax({
          url: musix_api_url + '/track.search?format=jsonp&callback=?&q_track=' + the_id  + '&page_size=1&apikey=' + client_id_misix,
          dataType: "json",
          success: function(data) {
            response(data["message"]["body"]["track_list"][0]["track"]["track_name"]);
          }
        });
      }, minLength: 1 
    })
}

// Retrieving Lyrics
function getTrackID (id) {
    var defer = new $.Deferred;
    $.getJSON(musix_api_url + '/track.search?format=jsonp&callback=?&q_track=' + id + '&page_size=1&apikey=' + client_id_misix,
        function(data) {
        var track_id = data["message"]["body"]["track_list"][0]["track"]["track_id"]
        console.log(track_id)
        defer.resolve(track_id);
    });
    return defer.promise() 
}

function getLyrics (id) {
    $.getJSON(musix_api_url + 'track.lyrics.get?format=jsonp&callback=?&track_id=' + id + '&apikey=' + client_id_misix,
    function(data){
        if(data["message"]["header"]["status_code"] !== 200) {
            $("#song_id-data").html(`<p>The song is not found in the database.</p>`);
        }
        else {
        $("#song_id-data").html(`<p>Lyrics: ${data["message"]["body"]["lyrics"]["lyrics_body"]}</p>`)
    }
})
}

function fetchSongInformation() {
    var song_id = $("#song_id").val();
    if (!song_id) {
    $("#song_id-data").html(`<p>Please enter a name of a song</p>`);
    }
    else(getTrackID(song_id).then(function(track_id){getLyrics(track_id)})
    )}