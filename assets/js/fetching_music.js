const musix_api_url = 'https://api.musixmatch.com/ws/1.1/'
const client_id_misix = '0d080d92b5b22fb4c5e349ed087defa8'
const youtube_API = 'AIzaSyAdXwgHUraNeXJ22jYuc2WFTMvRRo89CQE'
const lastFM_API = 'd7b03ea0c367902fbe0146692fa6b15a'

// Auto Complete Artist Name
function getListOfArtists() {
    let defer = new $.Deferred;
    $.getJSON(musix_api_url + 'artist.search?format=jsonp&callback=?&page_size=10&q_artist=' + $("#artist_id").val() + '&apikey=' + client_id_misix,
        function (data) {
            let list_can = [];
            for (var i = 0; i < 11; i++) {
                var candidate = data["message"]["body"]["artist_list"][i]["artist"]["artist_name"];
                list_can.push(candidate);
                defer.resolve(list_can);
            }
        })
    return defer.promise();
}

var selectItem = $("#artist_id").val();

function showListOfArtists(list) {
    $("#artist_id").autocomplete({
        source: list,
        select: selectItem,
        minLength: 1
    })
}

function getListOfAutocomplete() {
    getListOfArtists().then(function (list_artist) { showListOfArtists(list_artist) })
}


// Search Result Section
var page_num = 1;
function fetchArtistInformation() {
    $("#search_result_body2").html('');
    getSongList()
}

function getSongList() {
    var artist = $("#artist_id").val();
    $.getJSON(musix_api_url + 'track.search?format=jsonp&callback=?&q_artist='
        + artist + '&f_has_lyrics=true&s_track_rating=desc&page_size=15&page=' + page_num + '&apikey=' + client_id_misix,
        function (data) {
            if (data["message"]["header"]["status_code"] !== 200) {
                $("#search_result_body1").html(`<p>Error occured. Please try it again.</p>`)
            }
            else {
                $("#search_result_body1").html(`<h5>Choose a song to get the lyrics & video.</h5>`);
                $(data.message.body.track_list).each(function () {
                    let track_name = this.track.track_name;
                    $('<li name="track" class="song_name">' + track_name + '</li>').appendTo("#search_result_body2");
                });
                $('<button onclick="loadmore()" id="hide" class="btn btn-link">Load More</button>').appendTo("#search_result_body2");
            }
        }
    )
}

function loadmore() {
    $("#hide").remove();
    page_num++;
    getSongList();
}


// Retrieving Lyrics & Get Youtube video
function getLyrics() {
    let defer = new $.Deferred;
    $('body').on('click', '.song_name', function () {
        let i = $("li.song_name").index(this);
        let artist = $("#artist_id").val();
        var song = document.getElementsByName("track")[i].textContent;
        defer.resolve(song);
        $.getJSON(musix_api_url + 'matcher.lyrics.get?format=jsonp&callback=?&q_track='
            + song + '&q_artist=' + artist + '&apikey=' + client_id_misix,
            function (data) {
                console.log(data);
                let lyrics_body = data["message"]["body"]["lyrics"]["lyrics_body"].split("...")[0];
                let cleaned = lyrics_body.replace(/\r?\n/g, "<br />");
                $("#show_lyrics").html(`<h4>` + song + `</h4><div id="lyrics">` + cleaned + `</div>`)
            });
    });
    return defer.promise();
}

function googleApiClientReady(song_chosen) {
    gapi.client.setApiKey(youtube_API);
    gapi.client.load('youtube', 'v3', function () {
        search(song_chosen);
    });
}

function search(song_chosen) {
    let query_article = $("#artist_id").val();
    let request = gapi.client.youtube.search.list({
        q: song_chosen + ' ' + query_article,
        part: 'id',
        type: 'video',
        maxResults: 1
    });
    console.log(song_chosen);

    request.execute(function (response) {
        $("#video-window").html('');
        let video_id = response.result["items"][0]["id"]["videoId"];
        $("#video-window").html(`<h5>Watch the most related video.</h5><iframe width="100%" height="100%" src="https://www.youtube.com/embed/` + video_id +
            `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
        console.log(video_id);
    })
}

function fetchLyricsVideoInformation() {
    getLyrics().then(function (song) { googleApiClientReady(song) })
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
            if (data.message.body.artist_list.length !== 0) {
                $("#related_artist").html(`<h5>Recommended Artists</h5>`);
                $(data.message.body.artist_list).each(function () {
                    let related_artist = this.artist.artist_name;
                    $('<ul>' + related_artist + '</ul>').appendTo("#related_artist");
                })
            }
            else {
                $("#related_artist").html(`<h5>Recommended Artists</h5>
                <p>Data not found in the database.</p>`);
            }
        })
}

function fetchRelatedSongInformation() {
    getArtistID().then(function (artist_id) { getRelatedArtists(artist_id) })
}

function getInfoOfArtistLastFM() {
    $.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+ $("#artist_id").val() +'&api_key='+ lastFM_API + '&format=json',
        function (data) {
            $("#artist_info").html(`<h5>Artist Info from Last.FM</h5>`);
            let artist_listeners = data["artist"]["stats"]["listeners"];
            let artist_playcounts = data["artist"]["stats"]["playcount"];
            let artist_url = data["artist"]["url"];
            let artist_image = data["artist"]["image"][1]["#text"];
            console.log(data)
            console.log(artist_url)
            $("#artist_info").html('<h5>Artist Info from Last.FM</h5><div><div><p>In last.FM, there are... <br><b>' + artist_listeners + 
            ' </b>listeners<br><b>' + artist_playcounts + ' </b>playcounts</p><a href="' + artist_url + '" target=”_blank”>Visit Artist Page in last.FM</a>');
            })
        }
