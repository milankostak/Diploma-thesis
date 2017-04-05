const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const PORT = process.env.PORT || 3000;

var wsClient = null;

const server = express()
	.use(serveStatic(__dirname, {'controller': false}))
	.use(serveStatic(__dirname, {'receiver': false}))
	.use(bodyParser.json())
	.post('/show', (req, res) => {
		// console.log(req.body);
		if (wsClient != null) {
			wsClient.send(JSON.stringify(req.body));
		}
		res.sendStatus(200);
	})
	.listen(PORT, () => console.log(`App server running on ${ PORT }`));


const wsServer = new WebSocket.Server({ server });
console.log("WS server running.");	

wsServer.on('connection', (ws) => {
	wsClient = ws;
	/*ws.on('message', (message) => {
		console.log('Received msg from WS client: %s', message);
	});*/
	ws.on('close', (message) => {
		//console.log("WS connection closing: ", message);
		wsClient = null;
	});
});
