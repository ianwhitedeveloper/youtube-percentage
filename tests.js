QUnit.test( "init test", function ( assert ) {
  	YoutubeModule.init();
    assert.ok(typeof YT.player, 'object');
});
