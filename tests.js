QUnit.test( "init test", ( assert ) => {
  	YoutubeModule.init();
    assert.ok(typeof YT.player, 'object');
});
