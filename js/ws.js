"use strict";

/**
 * Object covers basic work with web sockets on the client side.
 * It is assigned by its inner anonymous self-invoking function. By using this approach some variables and functions can remain private.
 *
 * @public
 * @type {Object}
 * @author Milan Košťák
 * @version 1.0
 */
var WS = (function() {

	/**
	 * Main object which is exported into public WS variable.
	 * @public
	 * @type {Object}
	 */
	let WS = {};

	/**
	 * Holds information if web sockets are supported by the browser.
	 * Requires the init method to be called.
	 * @private
	 * @type {Boolean}
	 */
	let isSupported = false;

	/**
	 * Holds the URL of the web socket server
	 * @private
	 * @type {String}
	 */
	let host = "";

	/**
	 * Holds WebSocket reference
	 * @private
	 * @type {WebSocket}
	 */
	let wsClient = null;

	/**
	 * This method needs to be called at first to check if web sockets are supported
	 * @public
	 */
	WS.init = () => {
		if ("WebSocket" in window) {
			console.log("WebSocket: WS is supported by your browser!");
			isSupported = true;
			host = location.origin.replace(/^http/, 'ws');
		} else {
			console.log("%cWebSocket is NOT supported by your browser!", 'color: red');
		}
	};

	/**
	 * Main method, used for opening connection and receiving messages.
	 * Close method always tries to automatically reconnect.
	 * @public
	 * @param {Function} open    function to be called when connection is opened
	 * @param {Function} message function to be called when any data is received, called with parsed JSON data as parameter
	 * @param {Function} close   function to be called when connection is closed, called before trying to reconnect
	 */
	WS.setWebSocket = (open, message, close) => {

		if (!isSupported) {
			WS.init();
			if (!isSupported) return;
		}

		wsClient = new WebSocket(host);

		// refresh connection every 30 seconds
		let refreshInterval = setInterval(() => {
			wsClient.send("Refresh");
			console.log("WebSocket: refreshing connection");
		}, 30000);

		wsClient.onopen = () => {
			console.log("WebSocket: connection is opened.");
			open();
		};

		wsClient.onmessage = (e) => {
			let data = JSON.parse(e.data);
			message(data);
		};

		wsClient.onclose = () => {
			console.log("WebSocket: connection was closed.");
			console.log("WebSocket: trying to restore the connection...");
			clearInterval(refreshInterval);
			close();
			WS.setWebSocket(open, message, close);
		};

	};

	// export WS object
	return WS;
})();
