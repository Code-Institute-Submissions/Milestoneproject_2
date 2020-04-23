const musixApiUrl = 'https://api.musixmatch.com/ws/1.1/'
const clientIdMisix = '0d080d92b5b22fb4c5e349ed087defa8'
const youtubeAPI = 'AIzaSyAdXwgHUraNeXJ22jYuc2WFTMvRRo89CQE'
const lastFMAPI = 'd7b03ea0c367902fbe0146692fa6b15a'

function getListOfArtists() {
    let defer = new $.Deferred();
    $.getJSON(musixApiUrl + 'artist.search?format=jsonp&callback=?&page_size=10&q_artist=' + $("#artist").val() + '&apikey=' + clientIdMisix,
        function (data) {
            let listCan = [];
            let artistList = data.message.body.artist_list;
            for (var i = 0; i < artistList.length; i++) {
                var candidate = artistList[i].artist.artist_name;
                listCan.push(candidate);
                defer.resolve(listCan);
            }
        });
    return defer.promise();
}

var selectItem = $("#artist").val();

function showListOfArtists(list) {
    $("#artist").autocomplete({
        source: list,
        select: selectItem,
        minLength: 1
    });
}

function getListOfAutocomplete() {
    getListOfArtists().then(function (list_artist) { showListOfArtists(list_artist);
});
}


// Search Result Section
var pageNum = 1;
function fetchArtistInformation() {
    $("#search_result_body2").html('');
    getSongList();
}

function getSongList() {
    var artist = $("#artist").val();
    $.getJSON(musixApiUrl + 'track.search?format=jsonp&callback=?&q_artist='
+ artist + '&f_has_lyrics=true&s_track_rating=desc&page_size=15&page=' + pageNum + '&apikey=' + clientIdMisix,
        function (data) {
            if (data.message.header.status_code !== 200) {
                $("#search_result_body1").html(`<p>Error occured. Please try it again.</p>`);
            }
            else if (data.message.body.track_list.length == 0) {
                $("#search_result_body1").html(`<p>There is no data with the artist name in musixmatch database. <br>Please try a different name.</p>`);
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
    );
}

function loadmore() {
    $("#hide").remove();
    pageNum++;
    getSongList();
}


// Retrieving Lyrics & Get Youtube video
function getLyrics() {
    let defer = new $.Deferred();
    $('body').on('click', '.song_name', function () {
        let i = $("li.song_name").index(this);
        let artist = $("#artist").val();
        var song = document.getElementsByName("track")[i].textContent;
        defer.resolve(song);
        $.getJSON(musixApiUrl + 'matcher.lyrics.get?format=jsonp&callback=?&q_track='
            + song + '&q_artist=' + artist + '&apikey=' + clientIdMisix,
            function (data) {
                if (data.message.header.status_code == 200) {
                    let lyrics_body = data.message.body.lyrics.lyrics_body.split("...")[0];
                    let cleaned = lyrics_body.replace(/\r?\n/g, "<br />");
                    $("#show_lyrics").html(`<h4>` + song + `</h4><div id="lyrics">` + cleaned + `</div>`);
                }
                else if (data.message.header.status_code == 404) {
                    $("#show_lyrics").html(`<h5>Lyrics data was not found in musixmatch database. Please choose a different song or search another artist.</h5>`);
                }
                else {
                    $("#show_lyrics").html(`<h5>Error occured. Please try it again or choose a different song.</h5>`);
                }
            });
    });
    return defer.promise();
}

function googleApiClientReady(songChosen) {
    gapi.client.setApiKey(youtubeAPI);
    gapi.client.load('youtube', 'v3', function () {
        search(songChosen);
    });
}

function search(songChosen) {
    let queryArticle = $("#artist").val();
    let request = gapi.client.youtube.search.list({
        q: songChosen + ' ' + queryArticle,
        part: 'id',
        type: 'video',
        maxResults: 1
    });

    request.execute(function (response) {
        $("#video-window").html('');
        let videoId = response.result.items[0].id.videoId;
        $("#video-window").html(`<h5>Watch the most related video.</h5><iframe width="100%" height="100%" src="https://www.youtube.com/embed/` + videoId +
            `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        console.log(videoId);
    });
}

function fetchLyricsVideoInformation() {
    getLyrics().then(function (song) { googleApiClientReady(song) });
}


// Recommended Artists
function getArtistID() {
    let defer = new $.Deferred();
    let artist = $("#artist").val();
    $.getJSON(musixApiUrl + '/artist.search?format=jsonp&callback=?&q_artist=' + artist +
        '&page_size=1&apikey=' + clientIdMisix,
        function (data) {
            let artistId = data.message.body.artist_list[0].artist.artist_id;
            defer.resolve(artistId);
        });
    return defer.promise();
}

function getRelatedArtists(id) {
    $.getJSON(musixApiUrl + 'artist.related.get?format=jsonp&callback=?&artist_id=' + id +
        '&page_size=3&page=1&apikey=' + clientIdMisix,
        function (data) {
            if (data.message.body.artist_list.length !== 0) {
                $("#related_artist").html(`<h5>Recommended Artists</h5>`);
                $(data.message.body.artist_list).each(function () {
                    let related_artist = this.artist.artist_name;
                    $('<ul>' + related_artist + '</ul>').appendTo("#related_artist");
                });
            }
            else {
                $("#related_artist").html(`<h5>Recommended Artists</h5>
                <p>Data not found in musixmatch database.</p>`);
            }
        });
}

function fetchRelatedSongInformation() {
    getArtistID().then(function (artistId) { 
      getRelatedArtists(artistId); });
}

function getInfoOfArtistLastFM() {
    let artist = $("#artist").val();
    $("#artist_info").html('');
    $.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + lastFMAPI + '&format=json',
        function (data) {
            if (data.error == 6) {
                $("#artist_info").html('<h5>Artist Information from Last.FM</h5><p>There is no artist data about ' + artist + ' in  Last.FM</p>');
            }
            else {
                let artistUrl = data.artist.url;
                let artistListeners = data.artist.stats.listeners;
                let artistPlaycounts = data.artist.stats.playcount;
                $("#artist_info").html('<h5>Artist Information from Last.FM</h5><div><div><p>In last.FM, there are... <br><b>' + artistListeners +
                    ' </b>listeners<br><b>' + artistPlaycounts + ' </b>playcounts</p><a href="' + artistUrl + '" target=”_blank”>Visit Artist Page in last.FM</a>');
            }
        }
    );
}