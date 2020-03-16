var musix_api_url = 'https://api.musixmatch.com/ws/1.1/'
var client_id_misix = 'API KEY'
deepai.setApiKey('API KEY');

// Search Section
$("input[id='artist_search']").on("click", function () {
    $("#search_param").html(`
    <input type="text" id="artist_id" placeholder="Type Name of Artist">
    <button onclick="fetchArtistInformation()">Search</button>
    `);
})

$("input[id='song_search']").on("click", function () {
    $("#search_param").html(`
    <input type="text" id="song_id" placeholder="Type Name of Songs">
    <button onclick="fetchSongInformation()">Search</button>
    `);
})

// Search Result Section
function fetchArtistInformation() {
    let artist = $("#artist_id").val();
    $("#search_result_body").html('');
    $.getJSON(musix_api_url + 'track.search?format=jsonp&callback=?&q_artist='
        + artist + '&f_has_lyrics=true&s_track_rating=desc&page_size=5&apikey=' + client_id_misix,
        function (data) {
            if (data["message"]["header"]["status_code"] !== 200) {
                $("#search_result_body").html(`<p>Error occured. Please try it again.</p>`)
            }
            else {
                $("#search_result_body").html(`<p>Choose a song to get the lyrics.</p>`)
                $(data.message.body.track_list).each(function () {
                    let track_name = this.track.track_name;
                    $('<ul name="track" class="song_name">' + track_name + '</ul>').appendTo("#search_result_body");
                })
            }
        })
}

// Retrieving Lyrics
$('body').on('click', '.song_name', function () {
    let i = $("ul.song_name").index(this);
    let song = document.getElementsByName("track")[i].textContent;
    let artist = $("#artist_id").val();
    $.getJSON(musix_api_url + 'matcher.lyrics.get?format=jsonp&callback=?&q_track='
        + song + '&q_artist=' + artist + '&apikey=' + client_id_misix,
        function (data) {
            $("#lyrics_body").html(`<p id="lyrics">` + data["message"]["body"]["lyrics"]["lyrics_body"].split("...")[0] + 
            `</p><button onclick="SentimentAnalysis()">Sentiment Analysis</button>`)
        })
})

// Sentiment Analysis
function SentimentAnalysis() {
(async function () {
        var resp = await deepai.callStandardApi("sentiment-analysis", {
            text: document.getElementById('lyrics').textContent,
        });
        console.log(resp);
    })()
}

// Related Artists & Videos
function getArtistID() {
    let defer = new $.Deferred;
    let artist = $("#artist_id").val();
    $.getJSON(musix_api_url + '/artist.search?format=jsonp&callback=?&q_artist=' + artist + 
    '&page_size=1&apikey=' + client_id_misix,
        function (data) {
            let artist_id = data["message"]["body"]["artist_list"][0]["artist"]["artist_id"]
            defer.resolve(artist_id);
        });
        return defer.promise()
}

function getRelatedArtists(id){
    $.getJSON(musix_api_url + 'artist.related.get?format=jsonp&callback=?&artist_id=' + id + 
    '&page_size=3&page=1&apikey=' + client_id_misix,
    function(data){
        $(data.message.body.artist_list).each(function(){
            let related_artist = this.artist.artist_name;
            $('<ul>' + related_artist + '</ul>').appendTo("related_artist")
        })
    }
    )}
 
function fetchSongInformation() {
    getArtistID().then(function (artist_id) {getRelatedArtists(artist_id)})}