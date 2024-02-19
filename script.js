function test() {
    alert("toto"+pression)
}

let beta,
    gamma,
    pression = 0;
    gameover = false;
    n = 1;
    // sound1=false;

let loop = new SeamlessLoop();
    loop.addUri('ambiance.wav', 2000, 'sound1');
    loop.addUri('ambiancemid.wav', 2000, 'sound2');
    loop.addUri('ambiancehard.wav', 30000, 'sound3');
    loop.callback(soundsLoaded);

  function soundsLoaded() {
      loop.start('sound'+n);
  }

  let pace = function(){
      n++;
      loop.update("sound" + n, false);
  }

  function bannerAuthorisation() {
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      const banner = document.createElement("div");
      banner.innerHTML = `<div id="autorisation" style="z-index: 1; position: absolute; width: 100%; background-color:#000; color: #fff" onclick="clickRequestDeviceOrientationEvent()"><p style="padding: 10px">Cliquez ici pour autoriser l'accès à votre capteur de mouvements.</p></div>`;
  //  banner.onclick = clickRequestDeviceOrientationEvent();
      document.querySelector("body").appendChild(banner);
    } else {
      alert("Essaye avec un iphone");
      alert(typeof window.DeviceOrientationEvent);
      alert(typeof window.DeviceOrientationEvent.requestPermission);
      alert(typeof DeviceOrientationEvent.requestPermission);
    }
  }

  function clickRequestDeviceOrientationEvent() {
    window.DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", (e) => {
            document.getElementById("autorisation").style.display = "none";
            beta = Math.round(e.beta);
            gamma = Math.round(e.gamma);
            increasePression();
            changeColor();
            changeAngle();
            soundsLoaded();
            document.getElementById("jauge").innerHTML = "Pressions : "+ pression;
            document.getElementById("roulis").innerHTML = "Roulis : " + beta;
            document.getElementById("tangage").innerHTML = "Tangage : " + gamma;
          });
        } else {
          alert(
            "Désolé, vous ne pouvez pas jouer à ce jeu car votre appareil n'a pas de capteur de mouvement."
          );
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
