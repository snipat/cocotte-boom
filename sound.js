const loopify = function (){
loopify("ambiance.wav",function(err,loop){

  // If something went wrong, `err` is supplied
  if (err) {
    return console.err(err);
  }

  // Play it whenever you want

  // Stop it later if you feel like it
  //loop.stop();


});
}
loop.play();
