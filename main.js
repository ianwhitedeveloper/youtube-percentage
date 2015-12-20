var EVT = new EventEmitter2();

function timeEvent(data) {
    console.log('data ' , data);
    // call WT function here
}

function youTubeIframeAPIReady(data) {
    console.log('youTubeIframeAPIReady');
    $('body').on(
        'click', 
        '[rel="js-youtube-play"]', 
        (e) => { 
            var videoId = $(e.target).data('vid-id');
            EVT.emit('createPlayer', videoId)
        }
    );       
}

function youtubePlayerReady() {
    console.log('youtubePlayerReady');
}

function YTPlayerStartPLAYING() {
    console.log('YTPlayerStartPLAYING');
}

function YTPlayerInit() {
    console.log('YTPlayerInit');
}

$(document).ready(() => {
    YoutubeModule.init();
    EVT.emit('init');
    EVT.on('timeEvent', timeEvent);
    EVT.on('youTubeIframeAPIReady', youTubeIframeAPIReady);
    EVT.on('youtubePlayerReady', youtubePlayerReady);
    EVT.on('YTPlayerStartPLAYING', YTPlayerStartPLAYING);
    EVT.on('YTPlayerInit', YTPlayerInit);
});
