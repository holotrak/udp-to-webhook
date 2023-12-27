const dgram = require('dgram');
const http = require('http');
const url = require('url');

const udpServer = dgram.createSocket('udp4');
const httpServer = http.createServer();

const HTTP_SERVER_PORT = 8080;
const UDP_SERVER_PORT = 1234;


let clients = {};

// UDP server to store client info
udpServer.on('message', (msg, rinfo) => {
	const clientId = `${rinfo.address}:${rinfo.port}`;
	if (!clients[clientId]) {
		clients[clientId] = rinfo;
		console.log(`New UDP client connected: ${clientId}`);
	}

	console.log(`Received message from ${clientId}: ${msg}`);
});

udpServer.on('listening', () => {
	const address = udpServer.address();
	console.log(`UDP server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_SERVER_PORT); // UDP server listens on port 1234

// HTTP server to handle requests and send messages to a specific UDP client
httpServer.on('request', (req, res) => {
	const query = url.parse(req.url, true).query;
	const clientId = query.clientId; // Expecting clientId in the format "ip:port"
	const message = query.message || 'Hello from server';

	if (clients[clientId]) {
		const client = clients[clientId];
		udpServer.send(message, client.port, client.address, (error) => {
			if (error) {
				res.writeHead(500);
				res.end(`Error sending message to UDP client ${clientId}`);
			} else {
				res.writeHead(200);
				res.end(`Message sent to UDP client ${clientId}`);
			}
		});
	} else {
		res.writeHead(404);
		res.end(`UDP client ${clientId} not found`);
	}
});

httpServer.listen(HTTP_SERVER_PORT, () => {
	console.log('HTTP server listening on port 8080');
});

// Usage: Send an HTTP GET request to http://localhost:8080/?clientId=ip:port&message=YourMessage
