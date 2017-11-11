"use strict";

/**
 * Motion object holds all necessary functions for starting and ending of listening for DeviceMotionEvent.
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @requires sender.js
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
var Motion = (function() {

	/**
	 * Main object which is exported into public Motion variable.
	 * @public
	 * @type {Object}
	 */
	let Motion = {};

	/**
	 * Only if motion event is supported then it is possible to assign listener.
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
	 * Only every second set of motion data is being sent.
	 * Therefore these three variables hold previous values and later are used to calculate mean with the next values.
	 * Mean of two values is being sent.
	 * @private
	 * @type {Number}
	 */
	let tmpX = 0;
	let tmpY = 0;
	let tmpZ = 0;

	/**
	 * If an error occurs this variable prevents from showing the information multiple times.
	 * @private
	 * @type {Boolean}
	 */
	let errorShown = false;

	/**
	 * Holds information if program is currently listening for DeviceMotionEvent.
	 * Prevents multiple adding of this event.
	 * @private
	 * @type {Boolean}
	 */
	let isRunning = false;

	/**
	 * Main initialization  function.
	 * It checks if DeviceMotionEvent is supported by browser.
	 */
	Motion.init = function() {
		if (window.DeviceMotionEvent) {
			console.log("DeviceMotion is supported.");
			isSupported = true;
		} else {
			console.log("%cDeviceMotion is not supported.", 'color: red');
			window.alert("This device doesn't have all necessary sensors to determine its motion.");
			isSupported = false;
		}
	};

	/**
	 * Function adds listener for DeviceMotionEvent - only if it is supported and not added already.
	 * @public
	 */
	Motion.start = function() {
		if (isSupported && !isRunning) {
			window.addEventListener("devicemotion", deviceMotionHandler, false);
			isRunning = true;
		} else if (!isSupported) {
			console.log("%cDeviceMotion is not supported.", 'color: red');
			console.log("Did you run Motion.init function?");
		}
	};

	/**
	 * Function removes DeviceMotionEvent listener - only if it is supported and added before.
	 * @public
	 */
	Motion.finish = function() {
		if (isSupported && isRunning) {
			isRunning = false;
			window.removeEventListener("devicemotion", deviceMotionHandler, false);
		}
	};

	/**
	 * Handler for DeviceMotionEvent.
	 * Reads values from the event and sends to the server.
	 * @private
	 * @param  {DeviceMotionEvent} e
	 */
	function deviceMotionHandler(e) {
		// when phone is in typical position for this app - face to the user, top of the phone to the left, left side is going down
		// x - up, down
		// y - left, right
		// z - forward, backward

		let divisor = 2;

		if (sequence++ % divisor === 0) {
			tmpX = e.acceleration.x;
			tmpY = e.acceleration.y;
			tmpZ = e.acceleration.z;
			checkError(e);
		} else {
			let xToSend = (tmpX + e.acceleration.x) / divisor;
			let yToSend = (tmpY + e.acceleration.y) / divisor;
			let zToSend = (tmpZ + e.acceleration.z) / divisor;

			let obj = {
				type: "motion",
				time: new Date().getTime(),
				sequence: sequence / divisor,
				x: xToSend,
				y: yToSend,
				z: zToSend
			};
			Sender.add(obj);
		}
	}

	/**
	 * Checks if values of DeviceMotionEvent are "normal".
	 * @private
	 * @param  {DeviceMotionEvent} e
	 */
	function checkError(e) {
		if ((e.acceleration.x === null || e.acceleration.y === null || e.acceleration.z === null) && !errorShown) {
			let msg = "This device doesn't have all necessary sensors to determine its motion.";
			console.log("%c" + msg, 'color: red');
			window.alert(msg);
			window.removeEventListener("devicemotion", deviceMotionHandler, false);
			errorShown = true;
			isSupported = false;
			isRunning = false;
		}
	}

	// export Motion object
	return Motion;
})();
