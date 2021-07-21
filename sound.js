function launchAudio() {

  const audio = document.getElementById("au");

  const startPlaying = ()=>{
    audio.removeEventListener('playing', startPlaying);
    audio.src = 'https://github.com/mdn/webaudio-examples/blob/master/audio-basics/outfoxing.mp3';
    audio.play();
  }
  audio.addEventListener('playing', startPlaying);

}
launchAudio();
