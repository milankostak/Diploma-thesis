"use strict";

/**
 * Rotation object holds all necessary functions for starting and ending of listening for DeviceOrientationEvent.
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @requires sender.js
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
	 * Main initialization function.
	 * It checks if DeviceOrientationEvent is supported by browser.
	 */
	Rotation.init = function() {
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
	 * Function removes DeviceOrientationEvent listener - only if it is supported and added before.
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
		//
		// The alpha angle is 0° when top of the device is pointed directly toward the Earth's north pole, and increases as the device is rotated toward the left.
		//
		// The beta angle is 0° when the device's top and bottom are the same distance from the Earth's surface,
		// and increases toward 180° as the device is tipped forward and decreases toward -180° as the device is tipped backward.
		//
		// The gamma angle is 0° when the device's left and right sides are the same distance from the surface of the Earth,
		// and increases toward 90° as the device is tipped toward the right, and toward -90° as the device is tipped toward the left.
		//
		let divisor = 2;
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained
		if (sequence++ % divisor === 0) {
			tmpAlpha = e.alpha;
			tmpBeta = e.beta;
			tmpGamma = e.gamma;
			checkError(e);
		} else {
			let alphaToSend = (tmpAlpha + e.alpha) / divisor;
			let betaToSend = (tmpBeta + e.beta) / divisor;
			let gammaToSend = (tmpGamma + e.gamma) / divisor;

			let obj = {
				type: "rotation",
				time: new Date().getTime(),
				sequence: sequence / divisor,
				alpha: alphaToSend,
				beta: betaToSend,
				gamma: gammaToSend
			};
			Sender.add(obj);
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
			isSupported = false;
			isRunning = false;
		}
	}

	// export Rotation object
	return Rotation;
})();
