"use strict";

var Rotation = (function () {

	let map = new WeakMap();

	let _ = function(object) {
		if (!map.has(object))
			map.set(object, {});
		return map.get(object);
	}

	// Constructor
	function Rotation(foo) {
		if (window.DeviceOrientationEvent) {
			console.log("DeviceOrientation is supported.");
			_(this).isSupported = true;
			_(this).sequence = 0;
			_(this).tmpAlpha = 0;
			_(this).tmpBeta = 0;
			_(this).tmpGamma = 0;
			_(this).errorShown = false;
			_(this).handler = (e) => this.deviceOrientationHandler(e);
		} else {
			console.log("%cDeviceOrientation is not supported.", 'color: red');
			window.alert("This device doesn't have all necessary sensors to determine its rotation.");
			_(this).isSupported = false;
		}
		_(this).isRunning = false;
	}

	Rotation.prototype.deviceOrientationHandler = function(e) {
		if (!(e instanceof DeviceOrientationEvent)) {
			return;
		}
		// alpha is the compass direction the device is facing in degrees
		// beta is the front-to-back tilt in degrees, where front is positive
		// gamma is the left-to-right tilt in degrees, where right is positive
		let divisor = 2;
		if (_(this).sequence++ % divisor === 0) {
			_(this).tmpAlpha = e.alpha;
			_(this).tmpBeta = e.beta;
			_(this).tmpGamma = e.gamma;
			this.checkError(e);
		} else {
			let alphaToSend = (_(this).tmpAlpha + e.alpha) / 2.0;
			let betaToSend = (_(this).tmpBeta + e.beta) / 2.0;
			let gammaToSend = (_(this).tmpGamma + e.gamma) / 2.0;

			let request = new XMLHttpRequest();
			request.open('POST', "/ajax/rotation");
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			let obj = {
				type: "rotation",
				time: new Date().getTime(),
				sequence: _(this).sequence / divisor,
				alpha: alphaToSend,
				beta: betaToSend,
				gamma: gammaToSend
			};
			request.send(JSON.stringify(obj));
		}
	}

	Rotation.prototype.checkError = function(e) {
		if (!(e instanceof DeviceOrientationEvent)) {
			return;
		}
		if ((e.alpha === null || e.beta === null || e.gamma === null) && !_(this).errorShown) {
			let msg = "This device doesn't have all necessary sensors to determine its rotation.";
			console.log("%c" + msg, 'color: red');
			window.alert(msg);
			window.removeEventListener('deviceorientation', _(this).handler, false);
			_(this).errorShown = true;
		}
	}

	Rotation.prototype.start = function() {
		if (_(this).isSupported && !_(this).isRunning) {
			window.addEventListener('deviceorientation', _(this).handler, false);
			_(this).isRunning = true;
		}
	}

	Rotation.prototype.finish = function() {
		if (_(this).isSupported && _(this).isRunning) {
			_(this).isRunning = false;
			window.removeEventListener('deviceorientation', _(this).handler, false);
		}
	}

	return Rotation;
})();


