const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const PORT = process.env.PORT || 3000;
const wsClients = [];

const server = express()
	.use(serveStatic(__dirname, {'controller': false}))
	.use(serveStatic(__dirname, {'receiver': false}))
	.use(bodyParser.json())
	.post('/show', sendToClients)
	.listen(PORT, () => console.log(`App server is running.\nPort number: ${ PORT }`));

const wsServer = new WebSocket.Server({ server });
console.log("WS server is running.");

wsServer.on('connection', (ws) => {
	wsClients.push(ws);
	var host = ws['upgradeReq']['headers']['host'];

	console.log("WS: client connected from ", host);
	console.log("WS: number of clients: ", wsClients.length);

	// received message from client back to server
	ws.on('message', (message) => {
		console.log('WS: received message from client %s: %s', host, message);
	});

	// event for closing, remove closing client from array of active clients
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

function sendToClients(req, res) {
	res.sendStatus(200);
	// console.log(req.body);
	var data = JSON.stringify(req.body);

	wsClients.forEach((client) => {
		client.send(data);
	});

}