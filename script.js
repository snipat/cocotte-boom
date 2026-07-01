document.addEventListener("DOMContentLoaded", function(event) {
  var v = "Version : " + VERSION;
  document.getElementById("version").innerHTML = v;
  document.getElementById("splash-version").innerHTML = v;
});

const VERSION = 55;

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
      document.getElementById("jaune").style.opacity = "1";
      document.getElementById("red").style.opacity = "0";
      document.getElementById("orange").style.opacity = "0";
    } else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) {
      pression += 4;
      document.getElementById("jaune").style.opacity = "1";
      document.getElementById("orange").style.opacity = "1";
      document.getElementById("red").style.opacity = "0";
    } else if (beta >= 15 || beta <= -15) {
      pression += 6;
      document.getElementById("jaune").style.opacity = "1";
      document.getElementById("orange").style.opacity = "1";
      document.getElementById("red").style.opacity = "1";
    } else {
      pression += 1;
    }
    if ((gamma >= 10 && gamma < 15) || (gamma <= -10 && gamma > -15)) {
      pression += 2;
        document.getElementById("jaune").style.opacity = "1";
        document.getElementById("red").style.opacity = "0";
        document.getElementById("orange").style.opacity = "0";
      } else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) {
        pression += 4;
        document.getElementById("jaune").style.opacity = "1";
        document.getElementById("orange").style.opacity = "1";
        document.getElementById("red").style.opacity = "0";
      } else if (gamma >= 30 || gamma <= -30) {
        pression += 6;
        document.getElementById("jaune").style.opacity = "1";
        document.getElementById("orange").style.opacity = "1";
        document.getElementById("red").style.opacity = "1";
    } else {
      pression += 1;
    }
  }
}

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

  var bip1 = document.getElementById("bip1");
  var bip2 = document.getElementById("bip2");

  if (palier === 0) {
    cocotte.classList.replace('base', 'bouge');
    bip1.pause();
    bip2.pause();
  } else if (palier === 1) {
    cocotte.classList.replace('base', 'bouge');
    if (bip1.paused) bip1.play();
    bip2.pause();
  } else if (palier === 2) {
    cocotte.classList.replace('bouge', 'saute');
    bip1.pause();
    if (bip2.paused) bip2.play();
  } else if (palier === 3) {
    cocotte.classList.replace('saute', 'bondit');
    bip1.pause();
    if (bip2.paused) bip2.play();
  } else if (palier === 4) {
    gameover = true;
    bip1.pause();
    bip2.pause();
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
  ["ambiance", "bip1", "bip2", "ambiancemid", "ambiancehard", "boom", "whistle"].forEach(function(id) {
    var el = document.getElementById(id);
    el.play().then(function() { if (id !== "ambiance") el.pause(); }).catch(function(){});
  });
}

let muted = false;
const AUDIO_IDS = ["ambiance", "ambiancemid", "ambiancehard", "boom", "whistle", "bip1", "bip2"];

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
  document.getElementById("jaune").style.opacity = "0";
  document.getElementById("orange").style.opacity = "0";
  document.getElementById("red").style.opacity = "0";
  ["ambiancemid", "ambiancehard", "boom", "bip1", "bip2"].forEach(function(id) {
    var el = document.getElementById(id);
    el.pause();
    el.currentTime = 0;
  });
  document.getElementById("ambiance").play();
  document.getElementById("cocotte").className = "base";
}
