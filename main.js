/*(function(window) {
    var YouTubeIframeLoader = {
        src: 'https://www.youtube.com/iframe_api',
        loading: false,
        loaded: false,
        listeners: [],

        load: function(callback) {
            var _this = this;
            this.listeners.push(callback);

            if(this.loaded) {
                setTimeout(function() {
                    _this.done();
                });
                return;
            }

            if(this.loading) {
                return; 
            }

            this.loading = true;

            window.onYouTubeIframeAPIReady = function() {
                _this.loaded = true;
                _this.done();
            };

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.src;
            document.body.appendChild(script);
        },

        done: function() {
            delete window.onYouTubeIframeAPIReady;

            while(this.listeners.length) {
                this.listeners.pop()(window.YT);
            }
        }
    };

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = YouTubeIframeLoader;
    } else {
        window.YouTubeIframeLoader = YouTubeIframeLoader;
    }
}(window));
*/

/*YouTubeIframeLoader.load(function(YT) {
    new YT.Player('player1', {
        height: '390',
        width: '640',
        videoId: 'GcAKaeaSImU'
    });
});

YouTubeIframeLoader.load(function(YT) {
    new YT.Player('player2', {
        height: '390',
        width: '640',
        videoId: 'GcAKaeaSImU'
    });
});*/


var YoutubeModule = (() => {
    var src     = 'https://www.youtube.com/iframe_api',
        player;

    function onPlayerReady() {
        console.log('player ready');
        player.playVideo();
    }

    function onPlayerStateChange() {
        console.log('state change');
    }

    function init() {
        var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            document.body.appendChild(script);

            window.onYouTubeIframeAPIReady = function() {
                console.log('ready');
                $('[rel="js-youtube-play"]').click(loadVideo);                
            };
    }

    function loadVideo() {
        var videoId = $(this).data('vid-id');

        if (player) {
            player.destroy();
        }

        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
              rel: 0,
              autoplay: 0,
              autohide: 1,
              showinfo: 0,
              modestbranding: 0,
              color: "white"
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
    }

    return {
        init,
        loadVideo
    }
})();

$(document).ready(() => {
    YoutubeModule.init();


});
