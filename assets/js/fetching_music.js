var musix_api_url = 'https://api.musixmatch.com/ws/1.1/'
var client_id_misix = '0d080d92b5b22fb4c5e349ed087defa8'
deepai.setApiKey('8b511c81-08a3-4db2-9d6e-ced35b2d1d70');

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
        + artist + '&f_has_lyrics=true&s_track_rating=desc&page_size=20&apikey=' + client_id_misix,
        function (data) {
            if (data["message"]["header"]["status_code"] !== 200) {
                $("#search_result_body").html(`<p>Error occured. Please try it again.</p>`)
            }
            else {
                $("#search_result_body1").html(`<h5>Choose a song to get the lyrics.</h5>`)
                $(data.message.body.track_list).each(function () {
                    let track_name = this.track.track_name;
                    $('<li name="track" class="song_name">' + track_name + '</li>').appendTo("#search_result_body2");
                })
            }
        })
}

// Retrieving Lyrics
$('body').on('click', '.song_name', function () {
    let i = $("ul.song_name").index(this);
    let artist = $("#artist_id").val();
    var song = document.getElementsByName("track")[i].textContent;
    $.getJSON(musix_api_url + 'matcher.lyrics.get?format=jsonp&callback=?&q_track='
        + song + '&q_artist=' + artist + '&apikey=' + client_id_misix,
        function (data) {
        var lyrics_body = data["message"]["body"]["lyrics"]["lyrics_body"].split("...")[0];
        var cleaned = lyrics_body.replace(/\r?\n/g, "<br />");    
            console.log(cleaned);
            $("#show_lyrics").html(`<div id="lyrics">` + cleaned +
                `</div><button onclick="SentimentAnalysis()">Sentiment Analysis</button>`)
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

// Recommended Artists
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

function getRelatedArtists(id) {
    $.getJSON(musix_api_url + 'artist.related.get?format=jsonp&callback=?&artist_id=' + id +
        '&page_size=3&page=1&apikey=' + client_id_misix,
        function (data) {
            if (data.message.body.artist_list.length !== 0)
                $("#related_artist").html(`<h5>Recommended Artists</h5>`)
            $(data.message.body.artist_list).each(function () {
                let related_artist = this.artist.artist_name;
                $('<ul>' + related_artist + '</ul>').appendTo("#related_artist");
            })
        }
    )
}

function fetchSongInformation() {
    getArtistID().then(function (artist_id) { getRelatedArtists(artist_id) })
}

// Related Video
function googleApiClientReady() {
    gapi.client.setApiKey('AIzaSyDW6KJ1DWJykloq__vRMEXa3Hg4LxqlLAQ');
    gapi.client.load('youtube', 'v3', function () {
        search();
    });
}

function search() {
    var query = $("#artist_id").val();
    var request = gapi.client.youtube.search.list({
        q : query,
        part: 'id',
        type: 'video',
        maxResults: 1
    });

    request.execute(function (response) {
        var video_id = response.result["items"][0]["id"]["videoId"];
        $("#video-window").html(`<h5>Watch the most popular video of this artist</h5><iframe width="100%" height="100%" src="https://www.youtube.com/embed/` + video_id +
        `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
        console.log(video_id);
    })
}