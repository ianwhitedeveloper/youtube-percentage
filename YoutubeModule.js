(function ($,window){
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
                    EVT.emit('YTPlayerStartPLAYING');
                case YT.PlayerState.PLAYING:
                    startPlaybackProgress();
                    break;
                case -1: // Unstarted
                case YT.PlayerState.ENDED:
                case YT.PlayerState.CUED:
                    started = false;
                    q1 = q2 = q3 = q4 = false;
                    EVT.emit('YTPlayerReInit');
                default: // buffering, paused, video cued
                    clearInterval(progressTimer);
                    break;
            }
        }

        function startPlaybackProgress() {
            progressTimer = setInterval(function (){
                var playerCurrentTime = Math.ceil(player.getCurrentTime()),
                    playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100,
                    playerTimePercent = Math.ceil(playerTimeDifference);

                switch(true) {
                  case (!q1 && playerTimePercent >= 25):
                    q1 = true;
                    EVT.emit('timeEvent', '25')
                    break;
                  case (!q2 && playerTimePercent >= 50):
                    q2 = true;
                    EVT.emit('timeEvent', '50')
                    break;
                  case (!q3 && playerTimePercent >= 75):
                    q3 = true;
                    EVT.emit('timeEvent', '75')
                    break;
                  case (!q4 && playerTimePercent >= 100):
                    q4 = true;
                    EVT.emit('timeEvent', '100')
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
            q1 = q2 = q3 = q4 = false;
            
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