(($,window) => {
    var YoutubeModule = (() => {
        var src     = 'https://www.youtube.com/iframe_api',
            player,
            progressTimer,
            playerTotalTime,
            started,
            q1 = false, q2 = false, q3 = false, q4 = false;

        function onPlayerReady() {
            playerTotalTime = player.getDuration();
            EVT.emit('youtubePlayerReady');
        }

        function onPlayerStateChange(e) {
            switch (e.data) {
                case !started && YT.PlayerState.PLAYING:
                    EVT.emit('YTPlayerStartPLAYING');
                    started = true;
                case YT.PlayerState.PLAYING:
                    startPlaybackProgress();
                    break;
                case -1:
                case YT.PlayerState.ENDED:
                case YT.PlayerState.CUED:
                    EVT.emit('YTPlayerInit');
                    started = false;
                    q1 = q2 = q3 = q4 = false;
                default:
                    clearInterval(progressTimer);
                    break;
            }
        }

        function startPlaybackProgress() {
            progressTimer = setInterval(() => {
                var playerCurrentTime = Math.ceil(player.getCurrentTime()),
                    playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100,
                    playerTimePercent = Math.ceil(playerTimeDifference);

                switch(true) {
                  case (!q1 && playerTimePercent >= 25 && playerTimePercent < 50):
                    EVT.emit('timeEvent', '25')
                    q1 = true;
                    break;
                  case (!q2 && playerTimePercent >= 50 && playerTimePercent < 75):
                    EVT.emit('timeEvent', '50')
                    q2 = true;
                    break;
                  case (!q3 && playerTimePercent >= 75 && playerTimePercent < 100):
                    EVT.emit('timeEvent', '75')
                    q3 = true;
                    break;
                  case (!q4 && playerTimePercent >= 100):
                    EVT.emit('timeEvent', '100')
                    q4 = true;
                    break;
                  default:
                    break;
                };
                console.log('interval running');
            }, 100);
        }

        function init() {
            var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                document.body.appendChild(script);

                window.onYouTubeIframeAPIReady = function() {
                    EVT.emit('youTubeIframeAPIReady');
                };
        }

        function createPlayer(videoId) {
            
            if (player) {
                clearInterval(progressTimer);
                player.destroy();
            }

            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: videoId,
                playerVars: {
                  rel: 0,
                  autoplay: 1,
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

        EVT.on('init', init);
        EVT.on('createPlayer', createPlayer);

        var publicAPI = {
            init,
            createPlayer
        }

        return publicAPI;
    })();

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = YoutubeModule;
    } else {
        window.YoutubeModule = YoutubeModule;
    }
})(jQuery,window);