(($,window) => {
    var YoutubeModule = (() => {
        var src     = 'https://www.youtube.com/iframe_api',
            player,
            progressTimer,
            started;

        function onPlayerReady() {
            player.playVideo();
            EVT.emit('youtubePlayerReady');
        }

        function onPlayerStateChange(e) {
            switch (e.data) {
                case !started && YT.PlayerState.PLAYING:
                    EVT.emit('YTPlayerStatePLAYING');
                    started = true;
                    startPlaybackProgress();
                    break;
                case -1:
                case YT.PlayerState.ENDED:
                case YT.PlayerState.CUED:
                    EVT.emit('YTPlayerInit');
                    started = false;
                    break;
                default:
                    clearInterval(progressTimer);
                    break;
            }
        }

        function startPlaybackProgress() {
            var twentyFive = new $.Deferred(),
                fifty = new $.Deferred(),
                seventyFive = new $.Deferred(),
                oneHundred = new $.Deferred(),
                playerTotalTime = player.getDuration();

            progressTimer = setInterval(() => {
                var playerCurrentTime = Math.ceil(player.getCurrentTime()),
                    playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100,
                    playerTimePercent = Math.ceil(playerTimeDifference);

                switch(true) {
                  case (playerTimePercent >= 25 && playerTimePercent < 50):
                    twentyFive.resolve();
                    break;
                  case (playerTimePercent >= 50 && playerTimePercent < 75):
                    fifty.resolve();
                    break;
                  case (playerTimePercent >= 75 && playerTimePercent < 100):
                    seventyFive.resolve();
                    break;
                  case (playerTimePercent >= 100):
                    oneHundred.resolve();
                    break;
                  default:
                    break;
                };
            }, 100);

            twentyFive.then(() => {
                EVT.emit('timeEvent', '25')
            })

            fifty.then(() => {
                EVT.emit('timeEvent', '50')
            })

            seventyFive.then(() => {
                EVT.emit('timeEvent', '75')
            })

            oneHundred.then(() => {
                EVT.emit('timeEvent', '100')
            })
            
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

        EVT.on('init', init);
        EVT.on('createPlayer', createPlayer);

        return {
            init,
            createPlayer
        }
    })();

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = YoutubeModule;
    } else {
        window.YoutubeModule = YoutubeModule;
    }
})(jQuery,window);