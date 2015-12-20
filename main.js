var EVT = new EventEmitter2();

function timeEvent(data) {
    console.log('data ' , data);
    // call WT function here
}

function youTubeIframeAPIReady(data) {
    $('body').on(
        'click', 
        '[rel="js-youtube-play"]', 
        (e) => { 
            var videoId = $(e.target).data('vid-id');
            YoutubeModule.createPlayer(videoId);
        }
    );       
}

$(document).ready(() => {
    YoutubeModule.init();
    EVT.emit('init');
    EVT.on('timeEvent', timeEvent);
    EVT.on('youTubeIframeAPIReady', youTubeIframeAPIReady);
});
