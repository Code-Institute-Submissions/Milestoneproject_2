const musixApiUrl = 'https://api.musixmatch.com/ws/1.1/';
const clientIdMisix = '0d080d92b5b22fb4c5e349ed087defa8';
const youtubeAPI = 'AIzaSyAdXwgHUraNeXJ22jYuc2WFTMvRRo89CQE';
const lastFMAPI = 'd7b03ea0c367902fbe0146692fa6b15a';

let artistsName = "";

// Autocomplete
/**
 * Returns a list of artist names by keyword typed in #artist input form.
 * This list is used for the autocomple function called showListOfArtists().
 * @constructor
 */
function getListOfArtists(queryString) {
    let defer = new $.Deferred();
    $.getJSON(musixApiUrl + `artist.search?format=jsonp&callback=?&page_size=10&q_artist=${queryString}&apikey=${clientIdMisix}`,
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

/**
 * This is the autocomplete function.
 * @constructor
 * @param {string} list - list for autocomplete
 */
function showListOfArtists(list) {
    $("#artist").autocomplete({
        source: list,
        select: artistName,
        minLength: 1
    });
}

/**
 * This funcition implements firstly getListOfArtists() and secondly showListOfArtists().
 * @constructor
 */
function getListOfAutocomplete(event) {
    artistName = event.target.value;
    getListOfArtists(artistName).then(function (list_artist) {
        showListOfArtists(list_artist);
    });
}


// Search Result Section
/**
 * This function refresh the result section to be blank everytime the search button is pressed.
 * @constructor
 */
var pageNum = 1;
function fetchArtistInformation() {
    $("#search_result_body2").html('');
    getSongList();
}

/**
 * This function gets a list of songs by the searched artists and desplays them to the search result section.
 * @constructor
 */
function getSongList() {
    $.getJSON(musixApiUrl + `track.search?format=jsonp&callback=?&q_artist=
        ${artistName}&f_has_lyrics=true&s_track_rating=desc&page_size=15&page=${pageNum}&apikey=${clientIdMisix}`,
        function (data) {
            let resultBody = $("#search_result_body1");
            if (data.message.header.status_code !== 200) {
                resultBody.html(`<p>Error occured. Please try it again.</p>`);
            }
            else if (data.message.body.track_list.length == 0) {
                resultBody.html(`<p>There is no data with the artist name in musixmatch database. <br>Please try a different name.</p>`);
            }
            else {
                resultBody.html(`<h5>Choose a song to get the lyrics & video.</h5>`);
                $(data.message.body.track_list).each(function () {
                    let trackName = this.track.track_name;
                    $(`<li name="track" class="song_name">${trackName}</li>`).appendTo("#search_result_body2");
                });
                $('<button onclick="loadmore()" id="hide" class="btn btn-link">Load More</button>').appendTo("#search_result_body2");
            }
        }
    );
}

/**
 * This function loads one more set of songs by a click
 * @constructor
 */
function loadmore() {
    $("#hide").remove();
    pageNum++;
    getSongList();
}


// Gets Lyrics & Get Youtube video
/**
 * This function gets lyrics with the song selected, using musixmatch API.
 * Also, this function desplays the lyrics on the lyrics section which is at the center of a screen.
 * @constructor
 */
function getLyrics() {
    let defer = new $.Deferred();
    $('body').on('click', '.song_name', function () {
        let i = $("li.song_name").index(this);
        var song = document.getElementsByName("track")[i].textContent;
        defer.resolve(song);
        $.getJSON(musixApiUrl + `matcher.lyrics.get?format=jsonp&callback=?&q_track=
            ${song}&q_artist=${artistName}&apikey=${clientIdMisix}`,
            function (data) {
                let showLyrics = $("#show_lyrics");
                if (data.message.header.status_code == 200) {
                    let lyrics_body = data.message.body.lyrics.lyrics_body.split("...")[0];
                    let cleaned = lyrics_body.replace(/\r?\n/g, "<br />");
                    showLyrics.html(`<h4>${song}</h4><div id="lyrics">${cleaned}</div>`);
                }
                else if (data.message.header.status_code == 404) {
                    showLyrics.html(`<h5>Lyrics data was not found in musixmatch database. Please choose a different song or search another artist.</h5>`);
                }
                else {
                    showLyrics.html(`<h5>Error occured. Please try it again or choose a different song.</h5>`);
                }
            });
    });
    return defer.promise();
}

/**
 * This function loads the client interface for the YouTube API.
 * @constructor
 * @param {string} songChosen - a song name which is selected 
 */
function googleApiClientReady(songChosen) {
    gapi.client.setApiKey(youtubeAPI);
    gapi.client.load('youtube', 'v3', function () {
        search(songChosen);
    });
}

/**
 * This function searches Youtube video by Youtube API using the artist name and the selected song.
 * Also, it makes the video appear on the video section. 
 * @constructor
 * @param {string} songChosen - a song name which is selected 
 */
function search(songChosen) {
    let request = gapi.client.youtube.search.list({
        q: songChosen + ' ' + artistName,
        part: 'id',
        type: 'video',
        maxResults: 1
    });

    request.execute(function (response) {
        let videoWindow = $("#video-window");
        let videoId = response.result.items[0].id.videoId;
        videoWindow.html(`<h5>Watch the most related video.</h5><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        console.log(videoId);
    });
}

/**
 * This function implements firstly getLyrics() and secondly googleApiClientReady().
 * @constructor
 */
function fetchLyricsVideoInformation() {
    getLyrics().then(function (song) { googleApiClientReady(song) });
}


// Recommended Artists
/**
 * This function gets artist ID that is going to be used for searching recommended artists.
 * @constructor
 */
function getArtistID() {
    let defer = new $.Deferred();
    $.getJSON(musixApiUrl + `/artist.search?format=jsonp&callback=?&q_artist=${artistName}
        &page_size=1&apikey=${clientIdMisix}`,
        function (data) {
            let artistId = data.message.body.artist_list[0].artist.artist_id;
            defer.resolve(artistId);
        });
    return defer.promise();
}

/**
 * This function gets three recommended artists selected by the artist ID with musixmatch API
 * @constructor
 */
function getRelatedArtists(id) {
    $.getJSON(musixApiUrl + `artist.related.get?format=jsonp&callback=?&artist_id=${id}&page_size=3&page=1&apikey=${clientIdMisix}`,
        function (data) {
            if (data.message.body.artist_list.length !== 0) {
                $("#related_artist").html(`<h5>Recommended Artists</h5>`);
                $(data.message.body.artist_list).each(function () {
                    let related_artist = this.artist.artist_name;
                    $(`<ul>${related_artist}</ul>`).appendTo("#related_artist");
                });
            }
            else {
                $("#related_artist").html(`<h5>Recommended Artists</h5>
                <p>Data not found in musixmatch database.</p>`);
            }
        });
}

/**
 * This implements firstly getArtistID() and secondly getRelatedArtists().
 * @constructor
 */
function fetchRelatedSongInformation() {
    getArtistID().then(function (artistId) {
        getRelatedArtists(artistId);
    });
}

/**
 * This function gets listners, playcounts and artist URL with the searched artist name with Last.FM API.
 * Also it lets them appear in artist information section.
 * @constructor
 */
function getInfoOfArtistLastFM() {
    let artistInfo = $("#artist_info");
    artistInfo.html('');
    $.getJSON(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${lastFMAPI}&format=json`,
        function (data) {
            if (data.error == 6) {
                artistInfo.html(`<h5>Artist Information from Last.FM</h5><p>There is no artist data about ${artist} in Last.FM</p>`);
            }
            else {
                let artistUrl = data.artist.url;
                let artistListeners = data.artist.stats.listeners;
                let artistPlaycounts = data.artist.stats.playcount;
                artistInfo.html(`<h5>Artist Information from Last.FM</h5><div><div><p>In last.FM, there are... <br><b> ${artistListeners}
                     </b>listeners<br><b> ${artistPlaycounts} </b>playcounts</p><a href="${artistUrl}" target=”_blank”>Visit Artist Page in last.FM</a>`);
            }
        }
    );
}

/**
 * This function implements three different functions and it's used when the search button is clicked. 
 * @constructor
 */
function onClickSearch() {
    fetchArtistInformation();
    fetchRelatedSongInformation();
    getInfoOfArtistLastFM();
}