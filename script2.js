function test(){
console.log("coucou");
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

   function SeamlessLoop() {
     console.log("init seamless object",this)
    	this.is = {
    			  ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
    			  ie: Boolean(document.all && !window.opera),
    			  opera: Boolean(window.opera),
    			  chrome: Boolean(window.chrome),
    			  safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
    			};
    	console.debug("ff: " + this.is.ff);
    	console.debug("ie: " + this.is.ie);
    	console.debug("opera: " + this.is.opera);
    	console.debug("chrome: " + this.is.chrome);
    	console.debug("safari: " + this.is.safari);
    	this._total = 0;
    	this._load = 0;
    	this.cb_loaded;
    	this.cb_loaded_flag = new Boolean();
    	this.timeout;
    	this.playDelay = -30;
    	this.stopDelay = 30;
    	if(this.is.chrome) this.playDelay = -25;
    	if(this.is.chrome) this.stopDelay = 25;
    	if(this.is.ff) this.playDelay = -25;
    	if(this.is.ff) this.stopDelay = 85;
    	if(this.is.opera) this.playDelay = 5;
    	if(this.is.opera) this.stopDelay = 0;
    	console.debug(this.playDelay + ", " + this.stopDelay);
    	this.next = 1;
    	this.audios = new Array();
    	this.actual = new Array();
    	this.dropOld = new Boolean();
    	this.old;
    	this._volume = 1;

    	var t = this;
    	this._eventCanplaythrough = function(audBool) {
    		if(audBool == false) {
    			audBool = true;
    			t._load++;
    			if(t._load == t._total) {
    				t.loaded = true;
    				if(t.cb_loaded_flag == true) {
    					t.cb_loaded();
    					t.cb_loaded_flag = false;
    				}
    			}
    		}
    	};

    	this._eventPlaying = function(audMute) {
    		setTimeout(function() {
    			audMute.pause();
    			try {
    				audMute.currentTime = 0;
    			} catch (e){console.debug(e.message);};
    		}, t.stopDelay);

    		if(t.dropOld == true) {
    			setTimeout(function() {
    				if(t.old.paused == false) {
    					t.old.pause();
    					try {
    						t.old.currentTime = 0;
    					} catch (e){console.debug(e.message);};
    				}
    			}, t.stopDelay);
    			t.dropOld = false;
    		}
    	};

    	this._eventEnded = function(aud) {
    		aud.volume = this._volume;
    	};

    	this.doLoop = function() {
    		var key = (this.next == 1 ? "_1" : "_2");
    		var antikey = (this.next == 1 ? "_2" : "_1");

    		var t = this;
        console.log(this.actual)

    		this.timeout = setTimeout(function() {t.doLoop();}, this.actual._length + this.playDelay);

    		if(this.is.opera) this.actual[antikey].pause();

    		this.actual[key].play();
    		this.next *= -1;
    	};

    	this.isLoaded = function() {
    		return Boolean(this._load == this._total);
    	};
    }

    SeamlessLoop.prototype.start = function(id) {
      console.log("start", id, this)
    	if(id != "") {
    		this.actual = this.audios[id];
    	}
    	this.doLoop();
    };

    SeamlessLoop.prototype.volume = function(vol) {
    	if(typeof vol != "undefined") {
    		this.actual._1.volume = vol;
            	this.actual._2.volume = vol;
    		this._volume = vol;
    	}

    	return vol;
    };

    SeamlessLoop.prototype.stop = function() {
    	clearTimeout(this.timeout);
    	this.actual._1.currentTime = 0;
    	this.actual._1.pause();
    	this.actual._2.currentTime = 0;
    	this.actual._2.pause();
    };

    SeamlessLoop.prototype.callback = function(cb_loaded) {
    	this.cb_loaded = cb_loaded;
    	if(this.isLoaded() == true) cb_loaded();
    	else this.cb_loaded_flag = true;
    };

    SeamlessLoop.prototype.update = function(id, sync) {
    	//var key = (this.next == 1 ? "_1" : "_2");
    	var antikey = (this.next == 1 ? "_2" : "_1");

    	this.old = this.actual[antikey];
    	this.actual = this.audios[id];
    	if(sync == false) {
    		if(this.old.paused == false) {
    			this.dropOld = true;
    			if(this.is.opera) this.old.pause();
    		}
    		clearTimeout(this.timeout);
    		this.doLoop();
    	}
    };

    SeamlessLoop.prototype.addUri = function(uri, length, id) {
      console.log(uri, id)
    	this.audios[id] = new Array();
    	this.audios[id]._length = length;
    	var t = this;
    	this.audios[id]._1_isLoaded = new Boolean();
    	this.audios[id]._2_isLoaded = new Boolean();
    	this.audios[id]._1 = new Audio(uri);
    	this.audios[id]._2 = new Audio(uri);
    	this._total++;
    	this.audios[id]._1.addEventListener("canplaythrough", function() {t._eventCanplaythrough(t.audios[id]._1_isLoaded);});
    	this.audios[id]._2.addEventListener("canplaythrough", function() {t._eventCanplaythrough(t.audios[id]._2_isLoaded);});
    	this.audios[id]._1.addEventListener("playing", function() {t._eventPlaying(t.audios[id]._2);});
    	this.audios[id]._2.addEventListener("playing", function() {t._eventPlaying(t.audios[id]._1);});
    	this.audios[id]._1.addEventListener("ended", function() {t._eventEnded(t.audios[id]._1);});
    	this.audios[id]._2.addEventListener("ended", function() {t._eventEnded(t.audios[id]._2);});
    	this.audios[id]._1.load();
    	this.audios[id]._2.load();
    	this.audios[id]._1.volume = this._volume;
    	this.audios[id]._2.volume = this._volume;
      console.log(this.audios)
    };


// const whistle = document.getElementById("whistle");
// const ambiance = document.getElementById("ambiance");
// ambiance.play();

//const cocotte = document.getElementById("cocotte");

// var loop = new SeamlessLoop();
// loop.addUri('ambiance.wav', 3000,"amb");
// loop.callback(soundsLoaded);
// function soundsLoaded() {
//     var n = 1;
//     loop.start("amb" + n);
//     console.log("tutut")
// };



var loop = new SeamlessLoop();
loop.addUri('https://github.com/snipat/cocotte-boom/blob/main/ambiance.wav', 1000, "sound1");
loop.callback(soundsLoaded);
function soundsLoaded() {
    console.log('init sounds loadd', loop)
    var n = 1;
    loop.start("sound" + n);
};



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

// function increment(){
//     pression=pression+100;
//     console.log("increment"+ pression)
// }

function changeColor() {


  if (pression == 0) {
    document.getElementById("jauge").style.color = "purple";
  } else if (pression >= 0 && pression < 500) {
    document.getElementById("jauge").style.color = "green";
  } else if (pression >= 500 && pression < 1000) {
    document.getElementById("ambiance").pause();
// enlever JQUERY
    // audio.pause();
    // audio.currentTime = 0;
    // document.getElementById("ambiancemid").play();
    document.getElementById("jauge").style.color = "orange";
    document.getElementById("orange").style.opacity = "1";
    cocotte.classList.replace('base','bouge');
    // pace();
  } else if (pression >= 1000 && pression <= 2000) {
    document.getElementById("red").style.opacity = "1";
  } else {
    gameover = true;
    document.getElementById("explosion").play();
  }
}

function changeAngle(){
  if((beta >= 5 && beta < 10) || (beta <= -5 && beta > -10)){
    document.getElementById("gameZone").style.backgroundColor="green";
  }
  else if ((beta >= 10 && beta < 15) || (beta <= -10 && beta > -15)) {
    document.getElementById("gameZone").style.backgroundColor="orange";
  }
  else if (beta >= 15 || beta <= -15) {
    document.getElementById("gameZone").style.backgroundColor="red";
  }
  if ((gamma >= 10 && gamma < 15) || (gamma <= -10 && gamma > -15)) {
    document.getElementById("gameZone").style.backgroundColor="green";
  }
  else if ((gamma >= 15 && gamma < 30) || (gamma <= -15 && gamma > -30)) {
    document.getElementById("gameZone").style.backgroundColor="orange";
  }
  else if (gamma >= 30 || gamma <= -30) {
    document.getElementById("gameZone").style.backgroundColor="red";
  }
}




// loop.addUri(document.getElementById("ambiance"), 2000, "sound1");
// loop.addUri(document.getElementById("ambiancemid"), 4000, "sound2");
//
// loop.callback(soundsLoaded);
//
// function soundsLoaded() {
//     var n = 1;
//     loop.start("sound1" + n);
// };
//
// loop.start();//loop.stop();
// /**
// document.getElementById("start").addEventListener("click", function() {
// refreshInfo();
// });

// function refreshInfo() {
//  pression=0;
//}
