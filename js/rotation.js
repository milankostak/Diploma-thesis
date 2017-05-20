"use strict";

/**
 * Rotation object holds all necessary function for starting and ending of listening for DeviceOrientationEvent.
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
var Rotation = (function() {

	/**
	 * Main object which is exported into public Rotation variable.
	 * @public
	 * @type {Object}
	 */
	let Rotation = {};

	/**
	 * Only if rotation event is supported then it is possible to assign listener.
	 * Support is checked inside init function.
	 * @private
	 * @type {Boolean}
	 */
	let isSupported = false;

	/**
	 * Purpose of sequence is to be able to sort data on the other side or discard delayed ones.
	 * @private
	 * @type {Number}
	 */
	let sequence = 0;

	/**
	 * Only every second set of rotation data is being sent.
	 * Therefore these three variables hold previous values and later are used to calculate mean with the next values.
	 * Mean of two values is being sent.
	 * @private
	 * @type {Number}
	 */
	let tmpAlpha = 0;
	let tmpBeta = 0;
	let tmpGamma = 0;

	/**
	 * If an error occurs this variable prevents from showing the information multiple times.
	 * @private
	 * @type {Boolean}
	 */
	let errorShown = false;

	/**
	 * Holds information if program is currently listening for DeviceOrientationEvent.
	 * Prevents multiple adding of this event.
	 * @private
	 * @type {Boolean}
	 */
	let isRunning = false;

	/**
	 * Relative address on which the server is listening for rotation data.
	 * It is set by init function.
	 * @type {String}
	 */
	let address;

	/**
	 * Main initialization  function.
	 * Apart from setting the address, it checks if DeviceOrientationEvent is supported by browser.
	 * @param  {String} addr address on which the server is listening for rotation data
	 */
	Rotation.init = function(addr) {
		address = addr;
		if (window.DeviceOrientationEvent) {
			console.log("DeviceOrientation is supported.");
			isSupported = true;
		} else {
			console.log("%cDeviceOrientation is not supported.", 'color: red');
			window.alert("This device doesn't have all necessary sensors to determine its rotation.");
			isSupported = false;
		}
	};

	/**
	 * Function adds listener for DeviceOrientationEvent - only if it is supported and not added already.
	 * @public
	 */
	Rotation.start = function() {
		if (isSupported && !isRunning) {
			window.addEventListener("deviceorientation", deviceOrientationHandler, false);
			isRunning = true;
		} else if (!isSupported) {
			console.log("%cDeviceOrientation is not supported.", 'color: red');
			console.log("Did you run Rotation.init function?");
		}
	};

	/**
	 * Function removes DeviceOrientationEvent listener - only of it is supported and added before.
	 * @public
	 */
	Rotation.finish = function() {
		if (isSupported && isRunning) {
			isRunning = false;
			window.removeEventListener("deviceorientation", deviceOrientationHandler, false);
		}
	};

	/**
	 * Handler for DeviceOrientationEvent.
	 * Reads values from the event and sends to the server.
	 * @private
	 * @param  {DeviceOrientationEvent} e
	 */
	function deviceOrientationHandler(e) {
		// alpha is the compass direction the device is facing in degrees
		// beta is the front-to-back tilt in degrees, where front is positive
		// gamma is the left-to-right tilt in degrees, where right is positive
		let divisor = 2;
		if (sequence++ % divisor === 0) {
			tmpAlpha = e.alpha;
			tmpBeta = e.beta;
			tmpGamma = e.gamma;
			checkError(e);
		} else {
			let alphaToSend = (tmpAlpha + e.alpha) / divisor;
			let betaToSend = (tmpBeta + e.beta) / divisor;
			let gammaToSend = (tmpGamma + e.gamma) / divisor;

			let request = new XMLHttpRequest();
			request.open('POST', address);
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			let obj = {
				type: "rotation",
				time: new Date().getTime(),
				sequence: sequence / divisor,
				alpha: alphaToSend,
				beta: betaToSend,
				gamma: gammaToSend
			};
			request.send(JSON.stringify(obj));
		}
	}

	/**
	 * Checks if values of DeviceOrientationEvent are "normal".
	 * @private
	 * @param  {DeviceOrientationEvent} e
	 */
	function checkError(e) {
		if ((e.alpha === null || e.beta === null || e.gamma === null) && !errorShown) {
			let msg = "This device doesn't have all necessary sensors to determine its rotation.";
			console.log("%c" + msg, 'color: red');
			window.alert(msg);
			window.removeEventListener("deviceorientation", deviceOrientationHandler, false);
			errorShown = true;
		}
	}

	// export Rotation object
	return Rotation;
})();
