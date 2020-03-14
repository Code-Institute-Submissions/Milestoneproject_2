var musix_api_url = 'https://api.musixmatch.com/ws/1.1/'
var client_id_misix = '0d080d92b5b22fb4c5e349ed087defa8'

// Artist Search
var list_artists = [];
function getListOfArtists(artist) {
    let defer = new $.Deferred;
    $.getJSON(musix_api_url + 'artist.search?format=jsonp&callback=?&q_artist='
    + artist + '&page_size=5&f_has_lyrics=true&apikey=' + client_id_misix,
        function(data){
            var artist = data["message"]["body"]["artist_list"][0]["artist"]["artist_name"]
            if (list_artists.indexOf(artist) == -1) {
            list_artists.push(artist)
            defer.resolve(list_artists)
        }},
    );
        return defer.promise()
    }

function showListOfArtists(list){
    $("artist_id").autocomplete({
        minLength: 2,
        source: list
    })
}

function getAutocompleteArtists() {
    let artist_name = $("#artist_id").val();
    getListOfArtists(artist_name).then(function(list_artists){showListOfArtists(list_artists)})
}

// Retrieving Lyrics
function getTrackID (song) {
    let defer = new $.Deferred;
    $.getJSON(musix_api_url + '/track.search?format=jsonp&callback=?&q_track=' + song + '&page_size=1&apikey=' + client_id_misix,
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
            $("#song_id-data").html(`<p>The lyrics of the song is not found in the database.</p>`);
        }
        else {
        $("#song_id-data").html(`<p>Lyrics: ${data["message"]["body"]["lyrics"]["lyrics_body"]}</p>`)
    }
})
}

function fetchSongInformation() {
    let song_id = $("#song_id").val();
    if (!song_id) {
    $("#song_id-data").html(`<p>Please enter a name of a song</p>`);
    }
    else(getTrackID(song_id).then(function(track_id){getLyrics(track_id)})
    )}