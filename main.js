var EVT = new EventEmitter2();

function timeTracker(data) {
    console.log('data ' , data);
    // call WT function here
}

$(document).ready(() => {
    YoutubeModule.init();
    EVT.emit('init');
    EVT.on('timeEvent', timeTracker);
});
