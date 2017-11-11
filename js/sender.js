"use strict";

/**
 * Sender object holds all necessary functions for sending data to receiver as one big object.
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

	Sender.add = function(obj) {
		data.push(obj);
	};

	function send() {
		let request = new XMLHttpRequest();
		request.open('POST', '/ajax/data');
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		request.send(JSON.stringify(data));
		data.length = 0;
	}

	setInterval(function() {
		if (data.length > 0) send();
	}, 10);

	// export Sender object
	return Sender;
})();
