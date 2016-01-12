(function (window){
    var YoutubeModule = (function (){
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
                    started = true;
                    EVT.emit('YTPlayerFirstStart');
                case YT.PlayerState.PLAYING:
                    startPlaybackProgress();
                    break;
                default: // buffering, paused, video cued, unstarted 
                    clearInterval(progressTimer);
                    q1 = q2 = q3 = q4 = false;
                    break;
            }
        }

        function startPlaybackProgress() {
            progressTimer = setInterval(function (){
                var playerCurrentTime = Math.floor(player.getCurrentTime()),
                    playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100,
                    playerTimePercent = Math.floor(playerTimeDifference);

                switch(true) {
                  case (!q1 && playerTimePercent >= 25 && playerTimePercent < 50):
                    q1 = true;
                    EVT.emit('percentageEvent', '25')
                    break;
                  case (!q2 && playerTimePercent >= 50 && playerTimePercent < 75):
                    q2 = true;
                    EVT.emit('percentageEvent', '50')
                    break;
                  case (!q3 && playerTimePercent >= 75 && playerTimePercent < 99):
                    q3 = true;
                    EVT.emit('percentageEvent', '75')
                    break;
                  case (!q4 && playerTimePercent >= 99):
                    q4 = true;
                    EVT.emit('percentageEvent', '100')
                    break;
                  default:
                    break;
                };
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
            started = false;
        }

        EVT.on('init', init);
        EVT.on('createPlayer', createPlayer);

        var publicAPI = {
            init: init,
            createPlayer: createPlayer
        }

        return publicAPI;
    })();

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = YoutubeModule;
    } else {
        window.YoutubeModule = YoutubeModule;
    }
})(window);