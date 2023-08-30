var loop = new SeamlessLoop();

loop.addUri(document.getElementById("ambiance"), 2000, "sound1");
loop.addUri(document.getElementById("ambiancemid"), 4000, "sound2");

loop.callback(soundsLoaded);

function soundsLoaded() {
    var n = 1;
    loop.start("sound1" + n);
};
