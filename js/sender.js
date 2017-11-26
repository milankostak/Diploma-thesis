"use strict";

/**
 * Sender object holds all necessary functions for sending data to receiver as one object.
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
var Sender = (function() {

	/**
	 * Main object which is exported into public Sender variable.
	 * @public
	 * @type {Object}
	 */
	let Sender = {};

	/**
	 * Array of data to send
	 * @private
	 * @type {Array}
	 */
	let data = [];

	/**
	 * Identifier to uniquely distinguish between connected devices
	 * @type {string} hexa string
	 */
	const iud = Math.floor((Math.random() + 1) * 1000000000)// a bilion should be enough
				.toString(16) // transform to hexa
				.substring(1);// remove first char because the first one is not random

	/**
	 * Add object into array for sending.
	 * Adds identifier to the data object
	 * @public
	 * @param {object} obj object with data to send
	 */
	Sender.add = function(obj) {
		obj.id = iud;
		data.push(obj);
	};

	// interval that calls send() method every 10 ms is there are any data to be send
	setInterval(function() {
		if (data.length > 0) send();
	}, 10);

	/**
	 * Send all data every 10 ms (if there are any)
	 * @private
	 */
	function send() {
		let request = new XMLHttpRequest();
		request.open('POST', '/ajax/data');
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		request.send(JSON.stringify(data));
		data.length = 0;
	}

	// export Sender object
	return Sender;
})();
