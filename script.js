// ── Web Audio API ──────────────────────────────────────────────
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);

var audioBuffers = {};
var activeSources = {};

var AUDIO_FILES = {
  ambiance1: 'ambiance1.wav',
  ambiance2: 'ambiance2.wav',
  ambiance3: 'ambiance3.wav',
  ambiance4: 'ambiance4.wav',
  boom: 'explosion.wav',
  ping: 'ping.wav',
  alarm: 'alarm.wav'
};

function loadAudioFiles() {
  Object.keys(AUDIO_FILES).forEach(function(id) {
    fetch(AUDIO_FILES[id])
      .then(function(r) { return r.arrayBuffer(); })
      .then(function(buf) { return audioCtx.decodeAudioData(buf); })
      .then(function(decoded) { audioBuffers[id] = decoded; })
      .catch(function() {});
  });
}

function playLoop(id) {
  stopSound(id);
  if (!audioBuffers[id]) return;
  var source = audioCtx.createBufferSource();
  source.buffer = audioBuffers[id];
  source.loop = true;
  source.connect(masterGain);
  source.start(0);
  activeSources[id] = source;
}

function playOnce(id) {
  stopSound(id);
  if (!audioBuffers[id]) return;
  var source = audioCtx.createBufferSource();
  source.buffer = audioBuffers[id];
  source.loop = false;
  source.connect(masterGain);
  source.start(0);
  activeSources[id] = source;
  source.onended = function() { delete activeSources[id]; };
}

function stopSound(id) {
  if (activeSources[id]) {
    try { activeSources[id].stop(); } catch(e) {}
    delete activeSources[id];
  }
}

function stopAllSounds() {
  Object.keys(activeSources).forEach(stopSound);
}
// ───────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function(event) {
  loadAudioFiles();
  var v = "Version : " + VERSION;
  document.getElementById("version").innerHTML = v;
  document.getElementById("splash-version").innerHTML = v;
  // Desktop/Android : autoplay sans geste
  audioCtx.resume().then(function() { playLoop('ambiance1'); }).catch(function(){});
});

const VERSION = 118;

let beta,
    gamma,
    pression = 0,
    palier = 0,
    gameover = false,
    ambiance4Played = false;

function lancerLeJeu() {
  // Plein écran + verrouillage portrait (Android Chrome)
  var el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().then(function() {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(function(){});
      }
    }).catch(function(){});
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }

  // Resume AudioContext dans le geste utilisateur (obligatoire iOS)
  audioCtx.resume().then(function() { playLoop('ambiance1'); }).catch(function(){});

  if (
    window.DeviceOrientationEvent &&
    typeof window.DeviceOrientationEvent.requestPermission === "function"
  ) {
    window.DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          document.getElementById("splash").style.display = "none";
          window.addEventListener("deviceorientation", (e) => {
            beta = Math.round(e.beta);
            gamma = Math.round(e.gamma);
            increasePression();
            changeColor(pression);
            displayPression();
          });
        } else {
          alert("Désolé, votre appareil n'a pas de capteur de mouvement.");
        }
      })
      .catch((e) => { console.error(e); });
  } else {
    document.getElementById("splash").style.display = "none";
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

var thumbsUpTimer = null;
var inCalmZone = false;
var calmCooldown = false;

function showThumbsUp() {
  if (thumbsUpTimer) return;
  var el = document.getElementById("thumbs-up");
  el.style.display = "flex";
  thumbsUpTimer = setTimeout(function() {
    el.style.display = "none";
    thumbsUpTimer = null;
  }, 2000);
}

function increasePression() {
  if (gameover) return;

  pression += 1;

  var betaCalm = beta > -2 && beta < 2;
  var gammaCalm = gamma > -2 && gamma < 2;

  if (betaCalm && gammaCalm) {
    if (!inCalmZone && !calmCooldown) {
      inCalmZone = true;
      calmCooldown = true;
      pression = Math.max(0, pression - 500);
      showThumbsUp();
      playOnce('ping');
      setTimeout(function() { calmCooldown = false; }, 4000);
    }
  } else {
    inCalmZone = false;
  }

  var betaLevel = 0;
  if (!betaCalm) {
    if ((beta >= 5 && beta < 10) || (beta <= -5 && beta > -10)) { pression += 2; betaLevel = 1; }
    else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) { pression += 4; betaLevel = 2; }
    else if (beta >= 15 || beta <= -15) { pression += 6; betaLevel = 3; }
  }

  var gammaLevel = 0;
  if (!gammaCalm) {
    if ((gamma >= 5 && gamma < 10) || (gamma <= -5 && gamma > -10)) { pression += 2; gammaLevel = 1; }
    else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) { pression += 4; gammaLevel = 2; }
    else if (gamma >= 30 || gamma <= -30) { pression += 6; gammaLevel = 3; }
  }

  var niveau = Math.max(betaLevel, gammaLevel);
  document.getElementById("jaune").style.opacity  = niveau >= 1 ? "1" : "0";
  document.getElementById("orange").style.opacity = niveau >= 2 ? "1" : "0";
  document.getElementById("rouge").style.opacity  = niveau >= 3 ? "1" : "0";
  if (niveau >= 3 && !activeSources['alarm']) playOnce('alarm');
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
  document.getElementById('palier-info').textContent = 'Palier : ' + palier;

  var wrap = document.getElementById('cocotte-wrap');
  if (palier >= 1 && palier <= 3) {
    wrap.dataset.palier = palier;
  } else {
    wrap.removeAttribute('data-palier');
  }

  if (palier === 0) {
    stopSound('ambiance2'); stopSound('ambiance3'); stopSound('ambiance4');
    playLoop('ambiance1');
  } else if (palier === 1) {
    cocotte.classList.replace('base', 'bouge');
    stopSound('ambiance2'); stopSound('ambiance3'); stopSound('ambiance4');
    playLoop('ambiance1');
  } else if (palier === 2) {
    cocotte.classList.replace('bouge', 'saute');
    stopSound('ambiance1'); stopSound('ambiance3'); stopSound('ambiance4');
    playLoop('ambiance2');
  } else if (palier === 3) {
    cocotte.classList.replace('saute', 'bondit');
    stopSound('ambiance1'); stopSound('ambiance2'); stopSound('ambiance4');
    playLoop('ambiance3');
    if (!ambiance4Played) {
      ambiance4Played = true;
      playOnce('ambiance4');
      if (audioBuffers['ambiance4']) {
        var src = audioCtx.createBufferSource();
        src.buffer = audioBuffers['ambiance4'];
        src.connect(masterGain);
        activeSources['ambiance4'].onended = function() {
          src.start(0);
          activeSources['ambiance4'] = src;
          src.onended = function() { delete activeSources['ambiance4']; };
        };
      }
    }
  } else if (palier === 4) {
    gameover = true;
    stopSound('ambiance1'); stopSound('ambiance2'); stopSound('ambiance3');
    playOnce('boom');
    var explosion = document.getElementById("explosion");
    explosion.src = "explosion.gif?" + Date.now();
    document.getElementById("cocotte").style.display = "none";
    explosion.style.display = "block";
    setTimeout(function() {
      explosion.style.display = "none";
      document.getElementById("gameover-overlay").style.display = "flex";
    }, 2000);
  }
}

function toggleRegles() {
  var box = document.getElementById('regles-box');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

function closeReglesIfOutside(e) {
  var box = document.getElementById('regles-box');
  if (box.style.display === 'block' && !box.contains(e.target)) {
    box.style.display = 'none';
  }
}

function toggleInfoBox() {
  var box = document.getElementById('info-box');
  box.style.display = box.style.display === 'none' ? '' : 'none';
}

var muted = false;

function toggleMute() {
  muted = !muted;
  masterGain.gain.value = muted ? 0 : 1;
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
  document.getElementById("rouge").style.opacity = "0";
  document.getElementById('palier-info').textContent = 'Palier : 0';
  inCalmZone = false;
  calmCooldown = false;
  ambiance4Played = false;
  if (thumbsUpTimer) { clearTimeout(thumbsUpTimer); thumbsUpTimer = null; }
  document.getElementById("thumbs-up").style.display = "none";
  stopAllSounds();
  playLoop('ambiance1');
  document.getElementById("info-box").style.display = "";
  document.getElementById("explosion").style.display = "none";
  var cocotte = document.getElementById("cocotte");
  cocotte.style.display = "block";
  cocotte.className = "base";
  document.getElementById('cocotte-wrap').removeAttribute('data-palier');
}
