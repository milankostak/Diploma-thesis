"use strict";

const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const PORT = process.env.PORT || 3000;
const wsClients = [];

const server = express()
	.use(serveStatic(__dirname, {'controller': false}))
	.use(serveStatic(__dirname, {'receiver': false}))
	.use(serveStatic(__dirname, {'camera': false}))
	.use(bodyParser.json({limit: '5mb'}))
	.post('/show', receiveRotation)
	.post('/picture', receivePicture)
	.listen(PORT, () => console.log(`App server is running.\nPort number: ${ PORT }`));

const wsServer = new WebSocket.Server({ server });
console.log("WS: server is running.");

wsServer.on('connection', (ws) => {
	wsClients.push(ws);
	var host = ws.upgradeReq.headers.host;

	console.log("WS: client connected from ", host);
	console.log("WS: number of clients: ", wsClients.length);

	// receive a message from a client
	ws.on('message', (message) => {
		console.log('WS: received message from client %s: %s', host, message);
	});

	// event for closing, remove closing client from an array of active clients
	ws.on('close', (message) => {
		//console.log("WS: connection closing: ", message);
		console.log("WS: client closing ", host);
		let index = wsClients.indexOf(ws);
		if (index > -1) {
			wsClients.splice(index, 1);
		}
		console.log("WS: number of clients: ", wsClients.length);
	});
});

function receiveRotation(req, res) {
	res.sendStatus(200);
	// console.log(req.body);

	sendToClients(req.body);
}

function receivePicture(req, res) {
	res.sendStatus(200);
	//console.log(req.body.dataUrl.substr(0, 50));

	sendToClients(req.body);
}

function sendToClients(body) {
	var data = JSON.stringify(body);

	wsClients.forEach((client) => {
		client.send(data);
	});
}
