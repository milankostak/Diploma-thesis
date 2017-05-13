"use strict";

/**
 * Object covers basic work with web sockets on the client side
 * @version 1.0
 * @type {Object}
 * @author Milan Košťák
 */
var WS = {};

/**
 * Holds information if web sockets are supported by th browser.
 * Requires the init method to be called
 * @type {Boolean}
 */
WS.isSupported = false;

/**
 * Holds the URL of the web socket server
 * @type {String}
 */
WS.HOST = "";

/**
 * Holds WebSocket reference
 * @type {WebSocket}
 */
WS.ws = null;

/**
 * This method needs to be called at first to check if web scokets are supported
 */
WS.init = function() {
	if ("WebSocket" in window) {
		console.log("WebSocket: WS is supported by your browser!");
		WS.isSupported = true;
	} else {
		console.log("WebSocket is NOT supported by your browser!");
	}
};

/**
 * Main method, used for opening connection and receiving messages.
 * Close method always tries to automatically reconnect
 * @param {Function} open    function to be called when connection is opened
 * @param {Function} message function to be called when any data is received, called with parsed JSON data as parameter
 * @param {Function} close   function to be called when connection is closed, called before trying to reconnect
 */
WS.setWebSocket = function(open, message, close) {

	if (!WS.isSupported) {
		WS.init();
		if (!WS.isSupported) return;
	}

	WS.HOST = location.origin.replace(/^https?/, 'ws');
	WS.ws = new WebSocket(WS.HOST);

	// refresh connection every 30 seconds
	let refreshInterval = setInterval(() => {
		WS.ws.send("Refresh");
		console.log("WebSocket: refreshing connection");
	}, 30000);

	WS.ws.onopen = function() {
		console.log("WebSocket: connection is opened.");
		open();
	};

	WS.ws.onmessage = function (evt) {
		let data = JSON.parse(evt.data);
		message(data);
	};

	WS.ws.onclose = function() {
		console.log("WebSocket: connection was closed.");
		console.log("WebSocket: trying to restore the connection...");
		clearInterval(refreshInterval);
		close();
		WS.setWebSocket(open, message, close);
	};

};
