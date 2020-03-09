$(document).ready(function makeItem(data){
    return $.getJSON(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=dc02c030eccee4f9620e2021c8ea3a5d&artist=cher&track=believe&format=json`, 
    function(data){
        $("#track_id-data").html(`
        <p>Track Name: ${data["track"]["name"]}</p>
        <p>Song Name: ${data["track"]["artist"]["name"]}</p>
        <p>${data["track"]["name"]}</p>`);
        console.log(data);
        console.log(typeof data)
    });
});