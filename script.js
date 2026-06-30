document.addEventListener("DOMContentLoaded", function(event) {
  var v = "Version : " + VERSION;
  document.getElementById("version").innerHTML = v;
  document.getElementById("splash-version").innerHTML = v;
});

const VERSION = 30;

let beta,
    gamma,
    pression = 0,
    palier = 0,
    gameover = false,
    n = 1,
    sound1 = false;



function lancerLeJeu() {
  if (
    window.DeviceOrientationEvent &&
    typeof window.DeviceOrientationEvent.requestPermission === "function"
  ) {
    window.DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          document.getElementById("splash").style.display = "none";
          amb();
          window.addEventListener("deviceorientation", (e) => {
            beta = Math.round(e.beta);
            gamma = Math.round(e.gamma);
            increasePression();
            changeColor(pression);
            changeAngle();
            displayPression();
          });
        } else {
          alert("Désolé, votre appareil n'a pas de capteur de mouvement.");
        }
      })
      .catch((e) => { console.error(e); });
  } else {
    document.getElementById("splash").style.display = "none";
    amb();
    window.addEventListener("deviceorientation", (e) => {
      beta = Math.round(e.beta);
      gamma = Math.round(e.gamma);
      increasePression();
      changeColor();
      changeAngle();
      displayPression();
    });
  }
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

  var nouveauPalier;
  if (pression < 500)        nouveauPalier = 0;
  else if (pression < 1000)  nouveauPalier = 1;
  else if (pression < 2000)  nouveauPalier = 2;
  else if (pression < 3000)  nouveauPalier = 3;
  else                       nouveauPalier = 4;

  if (nouveauPalier === palier) return;
  palier = nouveauPalier;

  if (palier === 0) {
    document.getElementById("jauge").style.color = "green";
  } else if (palier === 1) {
    document.getElementById("jauge").style.color = "orange";
    document.getElementById("orange").style.opacity = "1";
    document.getElementById("ambiancemid").play();
    cocotte.classList.replace('base', 'bouge');
  } else if (palier === 2) {
    document.getElementById("red").style.opacity = "1";
    document.getElementById("ambiancemid").pause();
    document.getElementById("ambiancehigh").play();
    cocotte.classList.replace('bouge', 'saute');
  } else if (palier === 3) {
    document.getElementById("ambiancehigh").pause();
    document.getElementById("bipall").play();
    cocotte.classList.replace('saute', 'bondit');
  } else if (palier === 4) {
    gameover = true;
    var explosion = document.getElementById("explosion");
    explosion.src = "explosion.gif?" + Date.now();
    document.getElementById("boom").play();
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

let muted = false;
const AUDIO_IDS = ["ambiance", "ambiancemid", "ambiancehard", "boom", "whistle"];

function toggleMute() {
  muted = !muted;
  AUDIO_IDS.forEach(function(id) {
    document.getElementById(id).muted = muted;
  });
  document.getElementById("mute-btn").textContent = muted ? "🔇" : "🔊";
}

function closeGameOver() {
  document.getElementById("gameover-overlay").style.display = "none";
}

function retryGame() {
  pression = 0;
  palier = 0;
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
