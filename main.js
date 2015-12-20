(($,window) => {
    var YoutubeModule = (() => {
        var src     = 'https://www.youtube.com/iframe_api',
            player,
            progressTimer,
            started;

        function onPlayerReady() {
            console.log('player ready');
            player.playVideo();
        }

        function onPlayerStateChange(e) {
            console.log('state change');
            switch (e.data) {
                case !started && YT.PlayerState.PLAYING:
                    console.log('Playing');
                    started = true;
                    startPlaybackProgress();
                    break;
                case -1:
                case YT.PlayerState.ENDED:
                case YT.PlayerState.CUED:
                    console.log('restart');
                    started = false;
                    break;
                default:
                    clearInterval(progressTimer);
                    break;
            }
        }

        function startPlaybackProgress() {
                var twentyFive = false,
                    fifty = false,
                    seventyFive = false,
                    oneHundred = false;
            progressTimer = setInterval(() => {
                var playerCurrentTime = Math.ceil(player.getCurrentTime()),
                    playerTotalTime = player.getDuration(),
                    playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100,
                    playerTimePercent = Math.ceil(playerTimeDifference);

                switch(true) {
                  case (!twentyFive && playerTimePercent >= 25 && playerTimePercent < 50):
                    console.log('25');
                    twentyFive = true;
                    break;
                  case (!fifty && playerTimePercent >= 50 && playerTimePercent < 75):
                    console.log('50');
                    fifty = true;
                    break;
                  case (!seventyFive && playerTimePercent >= 75 && playerTimePercent < 100):
                    console.log('75');
                    seventyFive = true;
                    break;
                  case (!oneHundred && playerTimePercent >= 100):
                    console.log('100');
                    oneHundred = true;
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
                    console.log('ready');
                    $('body').on(
                        'click', 
                        '[rel="js-youtube-play"]', 
                        (e) => { 
                            var videoId = $(e.target).data('vid-id');
                            createPlayer(videoId);
                        }
                    );                
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

$(document).ready(() => {
    YoutubeModule.init();


});
