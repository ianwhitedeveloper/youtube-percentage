var EVT = new EventEmitter2();

(function ($,window) {
    var CustomYoutubeFunctionsModule = (function () {
        function quartileEvent(data) {
            console.log('data ' , data);
            // call WT function here
        }

        function youTubeIframeAPIReady(data) {
            console.log('youTubeIframeAPIReady');
            $('body').on(
                'click', 
                '[rel="js-youtube-play"]', 
                function (e) { 
                    var videoId = $(e.target).data('vid-id');
                    EVT.emit('createPlayer', videoId)
                }
            );       
        }

        function youtubePlayerReady() {
            console.log('youtubePlayerReady');
        }

        function YTPlayerFirstStart() {
            console.log('YTPlayerFirstStart');
        }

        function YTPlayerReInit() {
            console.log('YTPlayerReInit');
        }

        var publicAPI = {
            quartileEvent: quartileEvent,
            youtubePlayerReady: youtubePlayerReady,
            YTPlayerReInit: YTPlayerReInit,
            YTPlayerFirstStart: YTPlayerFirstStart,
            youTubeIframeAPIReady: youTubeIframeAPIReady
        }

        return publicAPI;
    })();

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = CustomYoutubeFunctionsModule;
    } else {
        window.CustomYoutubeFunctionsModule = CustomYoutubeFunctionsModule;
    }
})(jQuery,window);

$(document).ready(function () {
    YoutubeModule.init();
    EVT.emit('init');
    EVT.on('quartileEvent', CustomYoutubeFunctionsModule.quartileEvent);
    EVT.on('youTubeIframeAPIReady', CustomYoutubeFunctionsModule.youTubeIframeAPIReady);
    EVT.on('youtubePlayerReady', CustomYoutubeFunctionsModule.youtubePlayerReady);
    EVT.on('YTPlayerFirstStart', CustomYoutubeFunctionsModule.YTPlayerFirstStart);
    EVT.on('YTPlayerReInit', CustomYoutubeFunctionsModule.YTPlayerReInit);
});
