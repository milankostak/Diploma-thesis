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
	 * Add object into array for sending
	 * @public
	 * @param {object} obj object with data to send
	 */
	Sender.add = function(obj) {
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
