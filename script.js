document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("version").innerHTML = "Version : " + VERSION;
  amb();
});

const VERSION = 10;

let beta,
    gamma,
    pression = 0,
    gameover = false,
    n = 1,
    sound1 = false;



function bannerAuthorisation() {
  if (
    window.DeviceOrientationEvent &&
    typeof window.DeviceOrientationEvent.requestPermission === "function"
  ) {
    const banner = document.createElement("div");
    banner.innerHTML = `<div id="autorisation" style="z-index: 1; position: absolute; width: 100%; background-color:#000; color: #fff" onclick="clickRequestDeviceOrientationEvent()"><p style="padding: 10px">Cliquez ici pour autoriser l'accès à votre capteur de mouvements.</p></div>`;
    document.querySelector("body").appendChild(banner);
  } else {
    alert("Essaye avec un iphone");
    console.log(typeof window.DeviceOrientationEvent);
    console.log(typeof window.DeviceOrientationEvent.requestPermission);
    console.log(typeof DeviceOrientationEvent.requestPermission);
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
            changeColor(pression);
            changeAngle();
            displayPression();
          //  amb();
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

function displayPression() {
 document.getElementById("jauge").innerHTML = "Pression : "+ pression;
 document.getElementById("roulis").innerHTML = "Roulis : " + beta;
 document.getElementById("tangage").innerHTML = "Tangage : " + gamma;
}

function increasePression() {
  if (gameover) {

  } else {
    if ((beta >= 5 && beta < 10) || (beta <= -5 && beta > -10)) {
      pression += 2;
      } else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) {
        pression += 4;
      } else if (beta >= 15 || beta <= -15) {
        pression += 6;
    } else {
      pression += 1;
    }
    if ((gamma >= 10 && gamma < 15) || (gamma <= -10 && gamma > -15)) {
      pression += 2;
      } else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) {
        pression += 4;
      } else if (gamma >= 30 || gamma <= -30) {
        pression += 6;
    } else {
      pression += 1;
    }
  }
}

/*
function increment(){
    pression=pression+100;
    console.log("increment"+ pression)
}
*/

function changeColor(pression) {
  if (gameover) return;

  if (pression == 0) {
    document.getElementById("jauge").style.color = "purple";
  } else if (pression >= 0 && pression < 500) {
    document.getElementById("ambiance").play();
    document.getElementById("jauge").style.color = "green";
  } else if (pression >= 500 && pression < 1000) {
    document.getElementById("jauge").style.color = "orange";
    document.getElementById("orange").style.opacity = "1";
    document.getElementById("ambiancemid").play();
    cocotte.classList.replace('base','bouge');
  } else if (pression >= 1000 && pression < 2000) {
    document.getElementById("red").style.opacity = "1";
    document.getElementById("ambiancemid").pause();
    document.getElementById("ambiancehard").play();
  } else if (pression >= 2000 && pression < 3000) {
    document.getElementById("ambiancehard").pause();
    document.getElementById("boom").play();
    //document.getElementById("explosion").style.display = "block";
  } else if (pression >= 3000 && pression < 5000) {
    gameover = true;
    var explosion = document.getElementById("explosion");
    explosion.src = "explosion.gif?" + Date.now();
    explosion.style.display = "block";
    setTimeout(function() {
      explosion.style.display = "none";
      document.getElementById("gameover-overlay").style.display = "flex";
    }, 2000);
  }
}

function changeAngle(){
  if((beta >= 5 && beta < 10) || (beta <= -5 && beta > -10)){
  //  document.getElementById("gameZone").style.backgroundColor="green";
  }
  else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) {
//    document.getElementById("gameZone").style.backgroundColor="orange";
  }
  else if (beta >= 15 || beta <= -15) {
//    document.getElementById("gameZone").style.backgroundColor="red";
  }
  if ((gamma >= 10 && gamma < 15) || (gamma <= -10 && gamma > -15)) {
//    document.getElementById("gameZone").style.backgroundColor="green";
  }
  else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) {
//    document.getElementById("gameZone").style.backgroundColor="orange";
  }
  else if (gamma >= 30 || gamma <= -30) {
//    document.getElementById("gameZone").style.backgroundColor="red";
  }
}

function amb(){
  var ambianceAudio = document.getElementById("ambiance");
  ambianceAudio.play();
}

function closeGameOver() {
  document.getElementById("gameover-overlay").style.display = "none";
}

function retryGame() {
  pression = 0;
  gameover = false;
  document.getElementById("gameover-overlay").style.display = "none";
  document.getElementById("orange").style.opacity = "0.1";
  document.getElementById("red").style.opacity = "0.1";
  ["ambiancemid", "ambiancehard", "boom"].forEach(function(id) {
    var el = document.getElementById(id);
    el.pause();
    el.currentTime = 0;
  });
  document.getElementById("ambiance").play();
  document.getElementById("cocotte").className = "base";
}
