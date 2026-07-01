document.addEventListener("DOMContentLoaded", function(event) {
  var v = "Version : " + VERSION;
  document.getElementById("version").innerHTML = v;
  document.getElementById("splash-version").innerHTML = v;
  // Desktop : autoplay fonctionne directement
  document.getElementById("ambiance").play().catch(function(){});
  // iOS : déverrouiller ambiance au premier touch du splash
  document.getElementById("splash").addEventListener("touchstart", function() {
    document.getElementById("ambiance").play().catch(function(){});
  }, { once: true });
});

const VERSION = 60;

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

  var ambiance = document.getElementById("ambiance");
  var bip1 = document.getElementById("bip1");
  var bip2 = document.getElementById("bip2");
  var bip3 = document.getElementById("bip3");

  if (palier === 1) {
    cocotte.classList.replace('base', 'bouge');
    // ambiance continue, bips silencieux
    bip1.pause(); bip2.pause(); bip3.pause();
  } else if (palier === 2) {
    cocotte.classList.replace('bouge', 'saute');
    ambiance.pause();
    if (bip1.paused) bip1.play();
    bip2.pause(); bip3.pause();
  } else if (palier === 3) {
    cocotte.classList.replace('saute', 'bondit');
    ambiance.pause(); bip1.pause();
    if (bip2.paused) bip2.play();
    bip3.pause();
  } else if (palier === 4) {
    gameover = true;
    ambiance.pause(); bip1.pause(); bip2.pause();
    if (bip3.paused) bip3.play();
    var explosion = document.getElementById("explosion");
    explosion.src = "explosion.gif?" + Date.now();
    document.getElementById("cocotte").style.display = "none";
    explosion.style.display = "block";
    setTimeout(function() {
      bip3.pause();
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
  // Déverrouille tous les sons sur iOS (play+pause immédiat sauf ambiance)
  ["bip1", "bip2", "bip3", "boom"].forEach(function(id) {
    var el = document.getElementById(id);
    el.play().then(function() { el.pause(); el.currentTime = 0; }).catch(function(){});
  });
  document.getElementById("ambiance").play().catch(function(){});
}

let muted = false;
const AUDIO_IDS = ["ambiance", "boom", "bip1", "bip2", "bip3"];

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
  ["bip1", "bip2", "bip3", "ambiancemid", "ambiancehard", "boom"].forEach(function(id) {
    var el = document.getElementById(id);
    el.pause();
    el.currentTime = 0;
  });
  document.getElementById("ambiance").play();
  document.getElementById("explosion").style.display = "none";
  var cocotte = document.getElementById("cocotte");
  cocotte.style.display = "block";
  cocotte.className = "base";
}
