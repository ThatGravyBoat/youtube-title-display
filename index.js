let params = new URLSearchParams( location.search );
var tag = document.createElement('script');
var playlistNoEmbedCount = 0;

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '1080',
        width: '1920',
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    if (params.get("volume") != null){
        player.setVolume(params.get("volume"));
    } else player.setVolume(50);
    if (params.get("videoid") != null) {
        player.loadVideoById({
            videoId:params.get("videoid"), 
            startSeconds: 0
        })
    } else if (params.get("playlistid") != null){
        player.cuePlaylist({
            listType: 'playlist',
            list: params.get("playlistid"), 
            index:0,
            startSeconds:0}
        );
    }

}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING){
        $( ".title" ).text(player.getVideoData().title);
    }
    if (event.data == YT.PlayerState.ENDED) {
        $( ".title" ).text("no song!");
    }
    if (event.data == -1 || event.data == 5){
        player.playVideo();
    }
}
function onPlayerError(event) {
    if (event.data == 150 && player.getPlaylist() != null && playlistNoEmbedCount < 25){
        playlistNoEmbedCount++;
        player.nextVideo();
    } 
    else if (playlistNoEmbedCount >= 25)
        $( ".title" ).text("Playlist contains too many unembedable videos to continue.");
    else if (event.data == 150 || event.data == 101) 
        $( ".title" ).text("Video cant be played via embeds");
}