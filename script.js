let beta,
    gamma,
    pression = 0,
    gameover = false,
    stateLevel = "0",
    angle="0";

    const whistle = document.getElementById("whistle");
    const explosion = document.getElementById("explosion");
    const ambiance = document.getElementById("ambiance");

    const audio = document.getElementById("ambiance");
    audio.play();



//window.onload = function () {}

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
        const audio = document.getElementById("ambiance");
        audio.play();
        window.addEventListener("deviceorientation", (e) => {
          document.getElementById("autorisation").style.display = "none";
          beta = Math.round(e.beta);
          gamma = Math.round(e.gamma);
          changeColor();
          increasePression();
          document.getElementById("roulis").innerHTML = "Roulis : " + beta;
          document.getElementById("tangage").innerHTML = "Tangage : " + gamma;
          document.getElementById("state").innerHTML = "State : " + stateLevel;
          document.getElementById("jauge").innerHTML = "Pression :" + pression;
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

function test() {
  document.getElementById("difficulté").innerHTML = pression;
}

const audio = document.getElementById("ambiance");
audio.play();

function increasePression() {
  if (gameover) {
    document.getElementById("jauge").style.color = "purple";
//  document.getElementById("gameover").style.visibility = "visible";
  } else {
    if ((beta >= 5 && beta < 10) || (beta <= -5 && beta > -10)) {
      pression += 2;
      angle = "low"
      } else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) {
        pression += 4;
      } else if (beta >= 15 || beta <= -15) {
        pression += 6;
    } else {
      pression += 1;
    }
    if ((gamma >= 10 && gamma < 15) || (gamma <= -10 && gamma > -15)) {
      pression += 2;
      angle = "low"
      } else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) {
        pression += 4;
      } else if (gamma >= 30 || gamma <= -30) {
        pression += 6;
    } else {
      pression += 1;
    }
  }
}

function changeColor() {
  if (pression == 0) {
    document.getElementById("jauge").style.color = "purple";

    stateLevel = "bas";
  } else if (pression >= 0 && pression < 500) {
    document.getElementById("jauge").style.color = "green";
    stateLevel = "moyen";
  } else if (pression >= 500 && pression < 1000) {
    document.getElementById("jauge").style.color = "orange";
    document.getElementById("orange").style.opacity = "1";
    //audio2.play();
    stateLevel = "haut";
  } else if (pression >= 1000 && pression <= 2000) {
    document.getElementById("jauge").style.color = "red";
    //document.getElementById("gameZone").style.backgroundColor="red";
    stateLevel = "maximum";
  } else {
    gameover = true;
    //explosion.play();
  }
}

/* function changeAngle(){
  if(angle = "low"){
    document.getElementById("gameZone").style.backgroundColor="green";
  }
  else if (angle="mid") {
    document.getElementById("gameZone").style.backgroundColor="blue";
  }
  else if (angle="high") {
    document.getElementById("gameZone").style.backgroundColor="purple";
    }
}
*/
// document.getElementById("start").addEventListener("click", function() {
// refreshInfo();
// });

// function refreshInfo() {
//  pression=0;
//}
